import bcrypt from 'bcrypt';
import { jwtUtils } from '../utilis/jwtUtilis';
import { userRepository } from '../repositories/userRepository';
import { createError } from '../utilis/createError';
import { emailService } from './emailService';

export const authService = {
  async login(email: string, password: string): Promise<string> {
    try {
      if (!email || !password) {
        throw createError('Email and password are required', 400);
      }

      const user = await userRepository.findUserByEmail(email);

      if (!user) {
        throw createError('User not found', 404);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw createError('Invalid credentials', 401);
      }

      return jwtUtils.generateToken({ id: user.id, email: user.email });
    } catch (error: any) {
      console.error('Error during login:', error);

      if (error.code === 'ECONNREFUSED') {
        throw createError('Database connection error', 500);
      }

      if (error.name === 'TokenError') {
        throw createError('Error generating token', 500);
      }

      if (error.message === 'Invalid credentials') {
        throw createError('Invalid credentials', 401);
      }

      throw createError('Failed to authenticate user', 500);
    }
  },

  async requestPasswordResset(email: string): Promise<void> {
    const user = await userRepository.findUserByEmail(email);
    if(!user){
      throw createError('User not fount', 404);
    }

    const token = jwtUtils.generateToken({ id: user.id, email: user.email});
    const resetlink = `${process.env.CLIENT_URL}/set-new-password?token=${token}`;

    await emailService.sendPasswordResetEmail(user.email, resetlink);
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const decoded = jwtUtils.verifyToken(token);
    const user = await userRepository.findUserByEmail(decoded.email);

    if (!user) {
      throw createError('Invalid token or user not found', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updatePassword(user.id, hashedPassword);
  },
};
