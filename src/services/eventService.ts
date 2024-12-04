import { createError } from '../utilis/createError';
import { Event } from '../models/event';
import { eventRepository } from '../repositories/eventRepository';

export const eventService = {
  async createEvent(event: Omit<Event, 'id' | 'creator_id'>, creatorId: number): Promise<Event> {
    try {
      const eventWithCreator = { ...event, creator_id: creatorId };
      const createdEvent = await eventRepository.create(eventWithCreator);
        
      if (!createdEvent) {
          throw createError('Failed to create event, repository returned null or undefined', 500);
      }
      
      return createdEvent;
    } catch (error: any) {
      console.error('Error creating event:', error);
      if (error.code === '23505') {
        throw createError('Event with the same details already exists', 409);
      }
      if (error.code === '23502') {
        throw createError('Missing required fields for event creation', 400);
      }
      if (error.code === '23503') {
        throw createError('Invalid foreign key reference in event data', 400);
      }
      throw createError(`Failed to create event: ${error}`, 500);
    }
  },

  async getEventById(id: number): Promise<Event> {
    try {
      const event = await eventRepository.findById(id);
      if (!event) {
        throw createError('Event not found', 404);
      }
      return event;
    } catch (error: any) {
      console.error('Error fetching event by ID:', error);
      throw createError(`Failed to retrieve event: ${error}`, error.statusCode || 500);
    }
  },

  async getAllEvents(): Promise<Event[]> {
    try {
      const events =  await eventRepository.findAll()
      if (!events){
        throw createError('Failed to fetch events, repository returned null or undefined', 500);
      }
      return events;
    } catch (error: any) {
      console.error('Error fetching all events:', error);
      throw createError(`Failed to retrieve events: ${error}`, error.statusCode || 500);
    }
  },

  async updateEvent(id: number, event: Partial<Event>): Promise<Event> {
    try {
      const updatedEvent = await eventRepository.update(id, event);
      if (!updatedEvent) {
        throw createError('Event not found', 404);
      }
      return updatedEvent;
    } catch (error: any) {
      console.error('Error updating event:', error);
      if (error.code === '23503') {
        throw createError('Invalid foreign key reference in event data', 400);
      }
      throw createError(`Failed to update event: ${error}`, error.statusCode || 500);
    }
  },

  async deleteEvent(id: number): Promise<number> {
    try {
      const deletedEventId = await eventRepository.delete(id);
      
      if (!deletedEventId) {
        throw createError('Event not found', 404);
      }

      return deletedEventId;
    } catch (error: any) {
      console.error('Error deleting event:', error);
      throw createError(`Failed to delete event: ${error}`, error.statusCode || 500);
    }
  },

  async cancelEvent(id: number): Promise<number> {
    try {
      const canceledEventId = eventRepository.cancelEvent(id);

      if (!canceledEventId) {
        throw createError('Event not found', 404);
      }

      return canceledEventId;
    } catch (error: any) {
      console.error('Error canceling event:', error)
      throw createError(`Failed to cancel event with ID ${id}: ${error}`,error.statusCode || 500);
    }
  },
};
