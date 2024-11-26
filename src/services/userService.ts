import { userRepository } from '../repositories/userRepository';
import { User } from '../models/user';
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10;

export const userService = {
  async createUser(user: Omit<User, 'id'>): Promise<User | null> {
    try {
      const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
      const newUser = { ...user, password: hashedPassword } as User;

      return await userRepository.create('users', newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error creating user');
    }
  },

  async getUserById(id: number): Promise<User | string> {
    const user = await userRepository.findById('users', id);
    if (!user) {
      return 'User not found';
    }
    return user as User;  
  },
  

  async getAllUsers(): Promise<User[]> {
    const users = await userRepository.findAll('users') as User[];
    return users;
  },

  async updateUser(id: number, user: Partial<User>): Promise<User | string> {
    const updatedUser = await userRepository.update('users', id, user);
    if (!updatedUser) {
      return 'User not found';
    }
    return updatedUser;
  },

  async deleteUser(id: number): Promise<boolean> {
    return await userRepository.delete('users', id);
  },
};
