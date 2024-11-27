import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { wrapAsync } from '../utilis/wrapAsync.';

export const userController = {
    createUser: wrapAsync(async (req: Request, res: Response) => {
        const user = await userService.createUser(req.body);
        res.status(201).json({ success: true, message: 'User created successfully', data: user });
    }),

    getUserById: wrapAsync(async (req: Request, res: Response) => {
        const user = await userService.getUserById(Number(req.params.id));
        res.status(200).json({ success: true, data: user });
    }),

    getAllUsers: wrapAsync(async (req: Request, res: Response) => {
        const users = await userService.getAllUsers();
        res.status(200).json({ success: true, data: users });
    }),

    updateUser: wrapAsync(async (req: Request, res: Response) => {
        const user = await userService.updateUser(Number(req.params.id), req.body);
        res.status(200).json({ success: true, data: user });
    }),

    deleteUser: wrapAsync(async (req: Request, res: Response) => {
        await userService.deleteUser(Number(req.params.id));
        res.status(204).send();
    }),
};
