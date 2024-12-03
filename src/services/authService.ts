import bcrypt from 'bcrypt';
import { jwtUtils } from '../utilis/jwtUtilis';
import { userRepository } from '../repositories/userRepository';
import { createError } from '../utilis/createError';

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
};
