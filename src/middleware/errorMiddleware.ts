import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (err.message && err.message.includes('Error creating user')) {
    return res.status(400).json({ message: 'Invalid request, please check the input data' });
  }

  if (err.code === '23505') { 
    return res.status(400).json({ message: 'Duplicate entry, email must be unique' });
  }

  res.status(500).json({ message: 'Internal Server Error' });
};
