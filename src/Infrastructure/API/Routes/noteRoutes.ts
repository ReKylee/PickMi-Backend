import { Router } from "express";
import { authMiddleware } from "../../../Shared/Middlewares/authMiddleware.js";

const noteRouter = Router();

// It will run before the createNoteController.
noteRouter.post("/", authMiddleware); //, create);

export default noteRouter;
