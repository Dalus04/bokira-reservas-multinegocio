import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Prisma } from 'generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientValidationError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        // Defaults
        let status = HttpStatus.BAD_REQUEST;
        let message = 'Database error';

        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            // Common known errors:
            // P2002 unique constraint
            // P2025 record not found
            if (exception.code === 'P2002') {
                status = HttpStatus.CONFLICT;
                message = 'Unique constraint failed';
            } else if (exception.code === 'P2025') {
                status = HttpStatus.NOT_FOUND;
                message = 'Record not found';
            } else {
                status = HttpStatus.BAD_REQUEST;
                message = `Prisma error: ${exception.code}`;
            }
        }

        res.status(status).json({
            statusCode: status,
            message,
            path: req.url,
            timestamp: new Date().toISOString(),
        });
    }
}
