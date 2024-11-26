import express from 'express'
import userRoutes from './routes/userRoutes'
import { errorMiddleware } from './middleware/errorMiddleware';

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);

app.use(errorMiddleware);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error'})
});

export default app;