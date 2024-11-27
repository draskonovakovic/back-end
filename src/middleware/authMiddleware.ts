import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';

export function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    next();
  });
}
