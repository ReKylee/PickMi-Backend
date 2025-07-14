import { ForbiddenError } from "../Errors.js";
import { AuthenticatedRequest } from "./authMiddleware";

export const requireAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    if (req.user?.role !== "admin") {
        return next(new ForbiddenError("Admin access required."));
    }
    next();
};
