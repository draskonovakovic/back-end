import { Request, Response } from 'express';
import { wrapAsync } from '../utilis/wrapAsync.';
import { eventService } from '../services/eventService';
import { io } from '../server';

export const eventController = {
    createEvent: wrapAsync(async (req: Request , res: Response) => {
        const creatorId = req.user?.id; 
        if (!creatorId) {
            throw new Error('User ID not found in request');
        } 

        const event = await eventService.createEvent(req.body, creatorId);
        io.emit('newEvent', event);
        res.status(201).json({ success: true, message: 'Event created successfully', data: event });
    }),

    getEventById: wrapAsync(async (req: Request, res: Response) => {
        const eventId = Number(req.params.id);
    
        if (!eventId || isNaN(eventId)) {
            return res.status(400).json({ success: false, message: 'Invalid event ID' });
        }
    
        const event = await eventService.getEventById(eventId);
        res.status(200).json({ success: true, data: event });
    }),
    
    getAllEvents: wrapAsync(async (req: Request, res: Response) => {
        const events = await eventService.getAllEvents();
        res.status(200).json({ success: true, data: events });
    }),

    updateEvent: wrapAsync(async (req: Request, res: Response) => {
        const eventId = Number(req.params.id);
    
        if (!eventId || isNaN(eventId)) {
            return res.status(400).json({ success: false, message: 'Invalid event ID' });
        }
    
        const event = await eventService.updateEvent(eventId, req.body);
        io.emit('updatedEvent', event);
        res.status(200).json({ success: true, data: event });
    }),
    
    deleteEvent: wrapAsync(async (req: Request, res: Response) => {
        const eventId = Number(req.params.id);
    
        if (!eventId || isNaN(eventId)) {
            return res.status(400).json({ success: false, message: 'Invalid event ID' });
        }
    
        await eventService.deleteEvent(eventId);
        res.status(204).send();
    }),
    
    cancelEvent: wrapAsync(async(req: Request, res: Response) => {
        const eventId = Number(req.params.id);
    
        if (!eventId || isNaN(eventId)) {
            return res.status(400).json({ success: false, message: 'Invalid event ID' });
        }
    
        const canceledEventId = await eventService.cancelEvent(eventId);
        res.status(200).json({ success: true, data: canceledEventId });
    }),

    getFilteredEvents: wrapAsync(async (req: Request, res: Response) => {
        const { date, type, active, search } = req.query;
      
        if (date && isNaN(Date.parse(date as string))) {
          return res.status(400).json({ success: false, message: 'Invalid date format' });
        }
      
        const filters = {
          date: date as string | undefined,
          type: type as string | undefined,
          active: active as string | undefined,
          search: search as string | undefined,
        };
      
        const events = await eventService.getFilteredEvents(filters);
        res.status(200).json({ success: true, data: events });
    }),
      
    isUsersEvent: wrapAsync(async (req: Request, res: Response) => {
        const eventId = Number(req.params.id);
        const creatorId = req.user?.id; 

        if (!creatorId) {
            throw new Error('User ID not found in request');
        }

        if (!eventId || isNaN(eventId)) {
            return res.status(400).json({ success: false, message: 'Invalid event ID' });
        }

        const flag = await eventService.isUsersEvent(creatorId, eventId)
        res.status(200).json({ success: true, data: flag});
    }),

    getEventStatistic: wrapAsync(async (req: Request, res: Response) => {
        const userId = req.user?.id; 

        if (!userId) {
          throw new Error('User ID not found in request');
        } 

        const eventsWithStats = await eventService.getEventsWithStatistic(userId);
        res.status(200).json({ success: true, data: eventsWithStats});
    })
};
