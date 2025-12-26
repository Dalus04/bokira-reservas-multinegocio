import { HttpStatus } from '@nestjs/common';

export type ErrorDetail = {
    field?: string;
    message: string;
};

export type ErrorResponse = {
    statusCode: number;
    code: string;
    message: string;
    details?: ErrorDetail[];
    path: string;
    requestId?: string;
    timestamp: string;
};

export const ErrorCodes = {
    // generic
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',

    // auth
    AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
    AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
    AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',

    // database
    DB_UNIQUE_CONSTRAINT: 'DB_UNIQUE_CONSTRAINT',
    DB_NOT_FOUND: 'DB_NOT_FOUND',
    DB_ERROR: 'DB_ERROR',
} as const;

export function defaultCodeForStatus(status: number): string {
    switch (status) {
        case HttpStatus.UNPROCESSABLE_ENTITY:
            return ErrorCodes.VALIDATION_ERROR;
        case HttpStatus.UNAUTHORIZED:
            return ErrorCodes.AUTH_UNAUTHORIZED;
        case HttpStatus.FORBIDDEN:
            return ErrorCodes.AUTH_FORBIDDEN;
        case HttpStatus.CONFLICT:
            return ErrorCodes.DB_UNIQUE_CONSTRAINT; // si no hay code, esto suele ser la causa
        case HttpStatus.NOT_FOUND:
            return ErrorCodes.DB_NOT_FOUND;
        default:
            return status >= 500 ? ErrorCodes.INTERNAL_ERROR : ErrorCodes.DB_ERROR;
    }
}
