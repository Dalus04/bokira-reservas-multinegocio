import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        const isHttp = exception instanceof HttpException;

        const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const raw = isHttp ? exception.getResponse() : undefined;

        const message =
            typeof raw === 'string'
                ? raw
                : typeof raw === 'object' && raw && 'message' in raw
                    ? (raw as any).message
                    : isHttp
                        ? exception.message
                        : 'Internal server error';

        res.status(status).json({
            statusCode: status,
            message,
            path: req.url,
            timestamp: new Date().toISOString(),
        });
    }
}
