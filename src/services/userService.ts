import { createUserRepository } from '../repositories/userRepository';
import { User } from '../models/user';
const userRepository = createUserRepository();

export const userService = {
  async createUser(user: User): Promise<User> {
    return userRepository.create(user);
  },

  async getUserById(id: number): Promise<User | null> {
    return userRepository.findById(id);
  },

  async getAllUsers(): Promise<User[]> {
    return userRepository.findAll();
  },

  async updateUser(id: number, user: Partial<User>): Promise<User | null> {
    return userRepository.update(id, user);
  },

  async deleteUser(id: number): Promise<boolean> {
    return userRepository.delete(id);
  },
};
