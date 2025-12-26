import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Prisma } from 'generated/prisma/client';
import { ErrorCodes } from '../errors/error-response';

type ReqWithId = Request & { id?: string };

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(
        exception: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientValidationError,
        host: ArgumentsHost,
    ) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<ReqWithId>();

        const requestId =
            req.id ||
            (req.headers['x-request-id'] as string | undefined) ||
            undefined;

        let status = HttpStatus.BAD_REQUEST;
        let code: string = ErrorCodes.DB_ERROR;
        let message = 'Database error';

        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            if (exception.code === 'P2002') {
                status = HttpStatus.CONFLICT;
                code = ErrorCodes.DB_UNIQUE_CONSTRAINT;
                message = 'Unique constraint failed';
            } else if (exception.code === 'P2025') {
                status = HttpStatus.NOT_FOUND;
                code = ErrorCodes.DB_NOT_FOUND;
                message = 'Record not found';
            } else {
                status = HttpStatus.BAD_REQUEST;
                code = ErrorCodes.DB_ERROR;
                message = `Prisma error: ${exception.code}`;
            }
        } else {
            status = HttpStatus.UNPROCESSABLE_ENTITY;
            code = ErrorCodes.DB_ERROR;
            message = 'Invalid database query';
        }

        res.status(status).json({
            statusCode: status,
            code,
            message,
            path: req.url,
            requestId,
            timestamp: new Date().toISOString(),
        });
    }
}
