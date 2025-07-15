import { NextFunction } from "express";
import { ForbiddenError } from "../Errors.js";
import { AuthenticatedRequest } from "./authMiddleware.js";

export const requireAdmin = (
    req: AuthenticatedRequest,
    _: Response,
    next: NextFunction,
) => {
    if (req.user?.role !== "admin") {
        return next(new ForbiddenError("Admin access required."));
    }
    next();
};
