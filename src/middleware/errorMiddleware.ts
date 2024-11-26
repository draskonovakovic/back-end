import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  
    if (err) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
  
    res.status(500).json({ success: false, message: 'Internal Server Error' });
};
  
