import { createError } from '../utilis/createError';
import { Event } from '../models/event';
import { eventRepository } from '../repositories/eventRepository';
  
export const eventService = {
    async createEvent(event: Omit<Event, 'id'>): Promise<Event> {
      return eventRepository.create(event);
    },
  
    async getEventById(id: number): Promise<Event> {
      const event = await eventRepository.findById(id);
      if (!event) {
        throw createError('Event not found', 404);
      }
      return event;
    },
  
    async getAllEvents(): Promise<Event[]> {
      return eventRepository.findAll();
    },
  
    async updateEvent(id: number, event: Partial<Event>): Promise<Event> {
      const updatedEvent = await eventRepository.update(id, event);
      if (!updatedEvent) {
        throw createError('Event not found', 404);
      }
      return updatedEvent;
    },
  
    async deleteEvent(id: number): Promise<void> {
      const deleted = await eventRepository.delete(id);
      if (!deleted) {
        throw createError('Event not found', 404);
      }
    },
};
  