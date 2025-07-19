import express from 'express';
import { errorMiddleware } from './Middlewares/errorMiddleware.js';
import authRoutes from '../Infrastructure/API/Routes/authRoutes.js';
import noteRoutes from '../Infrastructure/API/Routes/noteRoutes.js';
import adminRouter from '../Infrastructure/API/Routes/adminRoutes.js';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/admin', adminRouter);

app.use(errorMiddleware);

export default app;
