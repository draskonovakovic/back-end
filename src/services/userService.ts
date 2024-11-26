import { userRepository } from '../repositories/userRepository';
import { User } from '../models/user';
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10;

const createError = (message: string, statusCode: number) => ({
    message,
    statusCode
});
  
export const userService = {
    async createUser(user: Omit<User, 'id'>): Promise<User> {
      const existingUser = await userRepository.findUserByEmail(user.email);
      if (existingUser) {
        throw createError('User with this email already exists', 409);
      }
  
      const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
      const newUser = { ...user, password: hashedPassword } as User;
  
      return userRepository.create('users', newUser);
    },
  
    async getUserById(id: number): Promise<User> {
      const user = await userRepository.findById('users', id) as User;
      if (!user) {
        throw createError('User not found', 404);
      }
      return user;
    },
  
    async getAllUsers(): Promise<User[]> {
      return userRepository.findAll('users');
    },
  
    async updateUser(id: number, user: Partial<User>): Promise<User> {
      const updatedUser = await userRepository.update('users', id, user);
      if (!updatedUser) {
        throw createError('User not found', 404);
      }
      return updatedUser;
    },
  
    async deleteUser(id: number): Promise<void> {
      const deleted = await userRepository.delete('users', id);
      if (!deleted) {
        throw createError('User not found', 404);
      }
    },
};
  