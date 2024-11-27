import express from 'express'
import userRoutes from './routes/userRoutes'
import { errorMiddleware } from './middleware/errorMiddleware';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);

app.use(errorMiddleware);

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
}));

export default app;