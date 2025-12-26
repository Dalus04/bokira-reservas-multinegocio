import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const http = context.switchToHttp();
        const req = http.getRequest<Request & { id?: string }>();
        const res = http.getResponse<any>();

        const requestId = (req.headers as any)['x-request-id'] || randomUUID();
        req.id = String(requestId);
        res.setHeader('x-request-id', String(requestId));

        return next.handle().pipe(tap(() => void 0));
    }
}
