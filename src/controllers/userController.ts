import { Request, Response } from 'express';
import { userService } from '../services/userService';

export const userController = {
  async createUser(req: Request, res: Response) {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  },

  async getUserById(req: Request, res: Response) {
    const user = await userService.getUserById(Number(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(user);
  },

  async getAllUsers(req: Request, res: Response) {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  },

  async updateUser(req: Request, res: Response) {
    const user = await userService.updateUser(Number(req.params.id), req.body);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(user);
  },

  async deleteUser(req: Request, res: Response) {
    const deleted = await userService.deleteUser(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    return res.status(204).send();
  },
};
