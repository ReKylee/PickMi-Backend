import { NextFunction, Request, Response } from 'express';
import { DomainError, UnexpectedError } from '../Errors.js';

export const errorMiddleware = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    if (err instanceof DomainError) {
        res.status(err.getStatusCode()).json({
            error: err.serialize(),
        });
        return;
    }

    console.error('Unexpected error:', err);

    // Handle unexpected errors
    const unexpectedError = new UnexpectedError(err);
    res.status(unexpectedError.getStatusCode()).json({
        error: unexpectedError.serialize(),
    });
};
