import { Router } from "express";
import { authMiddleware } from "../../../Shared/Middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post("/", authMiddleware); //, create);

export default authRouter;
