import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { wrapAsync } from '../utilis/wrapAsync.';
export const authController = {
  login: wrapAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const token = await authService.login(email, password);

    return res.status(200).json({ token });
  }),

  requestPasswordReset: wrapAsync( async (req: Request, res: Response) => {
    const { email } = req.body;
    await authService.requestPasswordResset(email);
    return res.status(200).json({  success: true, message: 'Password link sent to your email'});
  }),

  resetPassword: wrapAsync( async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    return res.status(200).json({  success: true, message: 'Password has been reset successfully'});
  })
};
