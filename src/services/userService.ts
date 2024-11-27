import { userRepository } from '../repositories/userRepository';
import { User } from '../models/user';
import { createError } from '../utilis/createError';
import bcrypt from 'bcrypt'
import { config } from '../config/config';
  
export const userService = {
    async createUser(user: Omit<User, 'id'>): Promise<User> {
      const existingUser = await userRepository.findUserByEmail(user.email);
      if (existingUser) {
        throw createError('User with this email already exists', 400);
      }

      const hashedPassword = await bcrypt.hash(user.password, config.bcrypt.saltRounds);

      const newUser = { ...user, password: hashedPassword };
      return userRepository.create(newUser);
    },
  
    async getUserById(id: number): Promise<User> {
      const user = await userRepository.findById(id);
      if (!user) {
        throw createError('User not found', 404);
      }
      return user;
    },
  
    async getAllUsers(): Promise<User[]> {
      return userRepository.findAll();
    },
  
    async updateUser(id: number, user: Partial<User>): Promise<User> {
      const updatedUser = await userRepository.update(id, user);
      if (!updatedUser) {
        throw createError('User not found', 404);
      }
      return updatedUser;
    },
  
    async deleteUser(id: number): Promise<void> {
      const deleted = await userRepository.delete(id);
      if (!deleted) {
        throw createError('User not found', 404);
      }
    },
};
  