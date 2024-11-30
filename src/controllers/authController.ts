import { Request, Response } from 'express';
import { authService } from '../services/authService';
export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const token = await authService.login(email, password);

      return res.status(200).json({ token });
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  },

  authCheck(req: Request, res: Response) {
    return res.status(200).json({});
  },
};
