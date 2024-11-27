import { Request, Response, NextFunction } from 'express';

export const userValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { name, surname, email, password } = req.body;

  if (!name || typeof name !== 'string' || !/^[A-ZČĆŽŠĐ][a-zčćžšđ]*$/.test(name)) {
    return res.status(400).json({ message: 'Name must start with an uppercase letter and contain only letters' });
  }

  if (!surname || typeof surname !== 'string' || !/^[A-ZČĆŽŠĐ][a-zčćžšđ]*$/.test(surname)) {
    return res.status(400).json({ message: 'Surname must start with an uppercase letter and contain only letters' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  next(); 
};
