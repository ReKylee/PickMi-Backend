import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from '../Errors.js';

interface JwtPayload {
    sub: string;
    role: 'user' | 'admin';
}

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: 'user' | 'admin';
    };
}

export const authMiddleware = (
    req: AuthenticatedRequest,
    _: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('No token provided.');
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your_default_secret',
        );

        if (
            typeof decoded === 'object' &&
            decoded !== null &&
            'sub' in decoded &&
            'role' in decoded
        ) {
            const { sub, role } = decoded as JwtPayload;
            req.user = { id: sub, role };
            next();
        } else {
            throw new AuthenticationError('Token is malformed.');
        }
    } catch (error) {
        next(new AuthenticationError('Invalid or expired token.'));
    }
};
