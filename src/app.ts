/// <reference path="./utilis/types.d.ts" />

import express from 'express'
import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import eventRoutes from './routes/eventRoutes'
import invitationRoutes from './routes/invitationRoutes'
import dotenv from 'dotenv';
import { errorMiddleware } from './middleware/errorMiddleware';
import cors from 'cors';

dotenv.config();

const envFile = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env.local';
dotenv.config({ path: envFile });

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000').split(',');

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/invitations', invitationRoutes)
app.use('/api/auth', authRoutes)

app.use(errorMiddleware);


export default app;