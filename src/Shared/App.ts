import express from "express";
import { errorMiddleware } from "./Middlewares/errorMiddleware.js";
import authRoutes from "../Infrastructure/API/Routes/userRoutes.js";
import noteRoutes from "../Infrastructure/API/Routes/noteRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.use(errorMiddleware);

export default app;
