import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';

export const jwtUtils = {
  generateToken(payload: object): string {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRY || '1h' });
  },

  verifyToken(token: string): any {
    return jwt.verify(token, SECRET_KEY);
  },

  extractToken(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
    return null;
  }
};