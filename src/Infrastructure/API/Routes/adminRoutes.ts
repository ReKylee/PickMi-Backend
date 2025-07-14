import { Router } from "express";
import { authMiddleware } from "../../../Shared/Middlewares/authMiddleware.js";

const adminRouter = Router();

// It will run before the createAdminController.
adminRouter.post("/", authMiddleware); //, create);

export default adminRouter;
