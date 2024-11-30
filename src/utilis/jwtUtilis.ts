import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';

export const jwtUtils = {
  generateToken(payload: object): string {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRY || '1h' });
  },

  verifyToken(token: string): any {
    return jwt.verify(token, SECRET_KEY);
  },

  extractUserId(authHeader: string | undefined): number {
    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1]; // Pretpostavlja 'Bearer <token>' format
    try {
      const decoded = this.verifyToken(token) as { id: number };
      if (!decoded.id) {
        throw new Error('Token does not contain user ID');
      }
      return decoded.id;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  },
};
