import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { defaultCodeForStatus } from '../errors/error-response';

type ReqWithId = Request & { id?: string };

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<ReqWithId>();

        const requestId =
            req.id ||
            (req.headers['x-request-id'] as string | undefined) ||
            undefined;

        const isHttp = exception instanceof HttpException;
        const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const raw = isHttp ? exception.getResponse() : null;

        // Normalización
        let message: string = status >= 500 ? 'Internal server error' : 'Request error';
        let code: string = defaultCodeForStatus(status);
        let details: any[] | undefined;

        if (typeof raw === 'string') {
            message = raw;
        } else if (raw && typeof raw === 'object') {
            const obj = raw as any;
            if (typeof obj.message === 'string') message = obj.message;
            if (Array.isArray(obj.message)) {
                // Nest a veces devuelve array de strings
                message = 'Invalid request';
                details = obj.message.map((m: string) => ({ message: m }));
            }
            if (typeof obj.code === 'string') code = obj.code;
            if (Array.isArray(obj.details)) details = obj.details;
        } else if (isHttp) {
            message = exception.message;
        }

        res.status(status).json({
            statusCode: status,
            code,
            message,
            details,
            path: req.url,
            requestId,
            timestamp: new Date().toISOString(),
        });
    }
}
