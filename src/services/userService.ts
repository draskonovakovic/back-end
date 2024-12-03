import { userRepository } from '../repositories/userRepository';
import { User } from '../models/user';
import { createError } from '../utilis/createError';
import bcrypt from 'bcrypt';
import { config } from '../config/config';

export const userService = {
  async createUser(user: Omit<User, 'id'>): Promise<User> {
    try {
      const existingUser = await userRepository.findUserByEmail(user.email);
      if (existingUser) {
        throw createError('User with this email already exists', 400);
      }
      const hashedPassword = await bcrypt.hash(user.password, config.bcrypt.saltRounds);
      const newUser = { ...user, password: hashedPassword };
      return await userRepository.create(newUser);
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.code === '23505') {
        throw createError('Email is already in use', 409);
      }
      throw createError(`Failed to create user: ${error}`, error.statusCode || 500);
    }
  },

  async getUserById(id: number): Promise<User> {
    try {
      const user = await userRepository.findById(id);
      if (!user) {
        throw createError('User not found', 404);
      }
      return user;
    } catch (error: any) {
      console.error('Error fetching user by ID:', error);
      throw createError(`Failed to retrieve user: ${error}`, error.statusCode || 500);
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      return await userRepository.findAll();
    } catch (error: any) {
      console.error('Error fetching all users:', error);
      throw createError(`Failed to retrieve users: ${error}`, error.statusCode || 500);
    }
  },

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    try {
      const existingUser = await userRepository.findById(id);
      if (!existingUser) {
        throw createError('User not found', 404);
      }
      if (user.email && user.email !== existingUser.email) {
        const emailInUse = await userRepository.findUserByEmail(user.email);
        if (emailInUse) {
          throw createError('Email is already in use by another user', 400);
        }
      }
      if (user.password) {
        user.password = await bcrypt.hash(user.password, config.bcrypt.saltRounds);
      }
      const updatedUser = await userRepository.update(id, user);

      if (!updatedUser) {
        throw createError('Failed to update user', 500);
      }

      return updatedUser;
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw createError(`Failed to update user: ${error}`, error.statusCode || 500);
    }
  },

  async deleteUser(id: number): Promise<number> {
    try {
      const deletedUserId = await userRepository.delete(id);
      if (!deletedUserId) {
        throw createError('User not found', 404);
      }

      return deletedUserId;
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw createError(`Failed to delete user: ${error}`, error.statusCode || 500);
    }
  },
};
