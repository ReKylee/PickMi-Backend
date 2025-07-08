import { Request, Response, NextFunction } from "express";
import { DomainError } from "../Errors.js";

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    // If the error is one of our custom domain errors, we can serialize it
    if (err instanceof DomainError) {
        return res.status(err.getStatusCode()).json(err.serialize());
    }

    // Log the actual error for debugging purposes
    console.error(err);

    return res.status(500).json({
        type: "UNEXPECTED_ERROR",
        message: "An unexpected error occurred on the server.",
    });
};
