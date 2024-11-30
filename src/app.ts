/// <reference path="./utilis/types.d.ts" />

import express from 'express'
import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import eventRoutes from './routes/eventRoutes'
import { errorMiddleware } from './middleware/errorMiddleware';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes)

app.use(errorMiddleware);


export default app;