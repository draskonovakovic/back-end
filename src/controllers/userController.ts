import { Request, Response } from 'express';
import { userService } from '../services/userService';

export const userController = {
  async createUser(req: Request, res: Response) {
    const user = req.body;
    const result = await userService.createUser(user);
    
    if (typeof result === 'string') {
      return res.status(409).json({ success: false, message: result });
    }
    
    return res.status(201).json({ success: true, message: 'User created successfully', data: result });
  },

  async getUserById(req: Request, res: Response) {
    const result = await userService.getUserById(Number(req.params.id));
    
    if (typeof result === 'string') {
      return res.status(404).json({ success: false, message: result });
    }
    
    return res.status(200).json({ success: true, data: result });
  },

  async getAllUsers(req: Request, res: Response) {
    const users = await userService.getAllUsers();
    return res.status(200).json({ success: true, data: users });
  },

  async updateUser(req: Request, res: Response) {
    const result = await userService.updateUser(Number(req.params.id), req.body);
    
    if (typeof result === 'string') {
      return res.status(404).json({ success: false, message: result });
    }
    
    return res.status(200).json({ success: true, data: result });
  },

  async deleteUser(req: Request, res: Response) {
    const result = await userService.deleteUser(Number(req.params.id));
    
    if (!result) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    return res.status(204).send();
  },
};
