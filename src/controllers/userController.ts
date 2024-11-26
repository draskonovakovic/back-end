import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';

export const userController = {
    async createUser(req: Request, res: Response, next: NextFunction) {
      try {
        const user = await userService.createUser(req.body);
        res.status(201).json({ success: true, message: 'User created successfully', data: user });
      } catch (error) {
        next(error);
      }
    },
  
    async getUserById(req: Request, res: Response, next: NextFunction) {
      try {
        const user = await userService.getUserById(Number(req.params.id));
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        next(error);
      }
    },
  
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
      try {
        const users = await userService.getAllUsers();
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        next(error);
      }
    },
  
    async updateUser(req: Request, res: Response, next: NextFunction) {
      try {
        const user = await userService.updateUser(Number(req.params.id), req.body);
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        next(error);
      }
    },
  
    async deleteUser(req: Request, res: Response, next: NextFunction) {
      try {
        await userService.deleteUser(Number(req.params.id));
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    },
};
  
