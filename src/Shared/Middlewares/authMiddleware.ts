import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticationError } from "../Errors.js";

interface JwtPayload {
    id: string;
    role: "user" | "admin";
}

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string; 
        role: "user" | "admin";
    };
}

export const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AuthenticationError("No token provided.");
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "your_default_secret",
        );

       if (
            typeof decoded === "object" &&
            decoded !== null &&
            "id" in decoded &&
            "role" in decoded
       ) {
            const { id, role } = decoded as JwtPayload;
            req.user = { id, role };
            next();
        } else {
            throw new AuthenticationError("Token is malformed.");
        }
    } catch (error) {
        // Pass a standardized error for any failure (invalid signature, expiration, etc.)
        next(new AuthenticationError("Invalid or expired token."));
    }
};
