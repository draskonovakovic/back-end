import { Request, Response } from 'express';
import { wrapAsync } from '../utilis/wrapAsync.';
import { eventService } from '../services/eventService';

export const eventController = {
    createEvent: wrapAsync(async (req: Request, res: Response) => {
        const event = await eventService.createEvent(req.body);
        res.status(201).json({ success: true, message: 'Event created successfully', data: event });
    }),

    getEventById: wrapAsync(async (req: Request, res: Response) => {
        const event = await eventService.getEventById(Number(req.params.id));
        res.status(200).json({ success: true, data: event });
    }),

    getAllEvents: wrapAsync(async (req: Request, res: Response) => {
        const events = await eventService.getAllEvents();
        res.status(200).json({ success: true, data: events });
    }),

    updateEvent: wrapAsync(async (req: Request, res: Response) => {
        const event = await eventService.updateEvent(Number(req.params.id), req.body);
        res.status(200).json({ success: true, data: event });
    }),

    deleteEvent: wrapAsync(async (req: Request, res: Response) => {
        await eventService.deleteEvent(Number(req.params.id));
        res.status(204).send();
    }),
};
