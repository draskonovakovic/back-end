import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';

export const jwtUtils = {
  generateToken(payload: object): string {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRY || '1h' });
  },

  verifyToken(token: string): any {
    return jwt.verify(token, SECRET_KEY);
  },
};
