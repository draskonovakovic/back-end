import { Request, Response } from 'express';
import { authService } from '../services/authService';
export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const token = await authService.login(email, password);

      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000, 
      });

      return res.status(200).json({ message: 'Login successful' });
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  },

  logout(req: Request, res: Response) {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return res.status(200).json({ message: 'Logged out successfully' });
  },

  authCheck(req: Request, res: Response) {
    return res.status(200).json({});
  },
};
