import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';
const INVITATION_SECRET_KEY = process.env.INVITATION_SECRET_KEY || 'default_invitation_secret';

export const jwtUtils = {
  generateToken(payload: object): string {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRY || '1h' });
  },

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      throw new Error('Error verifying token');
    }
  },

  extractToken(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
    return null;
  },

  generateInvitationToken(invitationId: number, userId: number): string {
    return jwt.sign(
      { invitationId, userId },
      INVITATION_SECRET_KEY,
      { expiresIn: '1h' }
    );
  },

  verifyInvitationToken(token: string): { invitationId: number; userId: number } {
    try {
      return jwt.verify(token, INVITATION_SECRET_KEY) as { invitationId: number; userId: number };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
};