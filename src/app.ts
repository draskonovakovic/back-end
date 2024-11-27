import express from 'express'
import userRoutes from './routes/userRoutes'
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

app.use(errorMiddleware);


export default app;