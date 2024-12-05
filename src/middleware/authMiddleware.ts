import express from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';

export function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.cookies?.auth_token || req.headers['authorization']?.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not found' });
  }

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY) as { id: number }; 
    req.user = decodedToken; 
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
}
