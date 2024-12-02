import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { wrapAsync } from '../utilis/wrapAsync.';
export const authController = {
  login: wrapAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const token = await authService.login(email, password);

    return res.status(200).json({ token });
  }),
};
