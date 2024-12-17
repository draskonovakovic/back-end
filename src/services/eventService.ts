import { createError } from '../utilis/createError';
import { Event } from '../models/event';
import { eventRepository } from '../repositories/eventRepository';
import { invitationRepository } from '../repositories/invitationRepository';
import { VALID_EVENT_TYPES } from '../config/eventTypes';
import { EventStats } from '../models/eventStats';

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
      throw createError(`Failed to create event: ${error.message}`, error.statusCode || 500);
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
      throw createError(`Failed to retrieve event: ${error.message}`, error.statusCode || 500);
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
      throw createError(`Failed to retrieve events: ${error.message}`, error.statusCode || 500);
    }
  },

  async updateEvent(id: number, event: Partial<Event>): Promise<Event> {
    try {
      event.notifications_sent = {};
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
      throw createError(`Failed to update event: ${error.message}`, error.statusCode || 500);
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
      throw createError(`Failed to delete event: ${error.message}`, error.statusCode || 500);
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
      throw createError(`Failed to cancel event with ID ${id}: ${error.message}`,error.statusCode || 500);
    }
  },

  async getFilteredEvents(filters: {
    date?: string;
    type?: string;
    active?: string;
    search?: string;
  }): Promise<Event[]> {
    try {
      if (filters.date && isNaN(Date.parse(filters.date))) {
        throw createError('Invalid date format provided in filters', 400);
      }

      if (filters.type && !VALID_EVENT_TYPES.includes(filters.type)) {
        throw createError(
          `Invalid event type provided. Valid types are: ${VALID_EVENT_TYPES.join(', ')}`,
          400
        );
      }

      if (filters.active && filters.active !== 'true' && filters.active !== 'false' ) {
        throw createError(
          `Invalid value for 'active' provided. Only 'true' or 'false' are allowed.`,
          400
        );
      }
  
      const events = await eventRepository.getFilteredEvents(filters);
  
      if (!events || events.length === 0) {
        return []
      }
  
      return events;
    } catch (error: any) {
      console.error('Error fetching filtered events:', error);
      throw createError(`Error filtering events: ${error.message}`,error.statusCode || 500);
    }
  },

  async isUsersEvent(creatorId: number, eventId: number): Promise<boolean> {
    try {
      const event = await eventRepository.findById(eventId);
  
      if (!event) {
        throw createError(`Event with ID ${eventId} not found.`, 404);
      }
  
      return creatorId === event.creator_id;
    } catch (error: any) {
      console.error('Error checking if this is user\'s event:', error);
  
      throw createError(
        `Error checking if this is user's event: ${error.message}`,
        error.statusCode || 500
      );
    }
  },

  async getEventsWithStatistic(userId: number): Promise<EventStats[]> {
    try {
      const events = await eventRepository.findEventsByCreatorId(userId);

      if (!Array.isArray(events)) {
        throw new Error('Expected an array of events, but got a different data type.');
      }

      const eventsWithStats: EventStats[] = [];

      for (const event of events) {
        if (!event || typeof event.id !== 'number') {
          throw new Error('Invalid event object encountered.');
        }

        const stats = await invitationRepository.getInvitationStatsByEventId(event.id);

        eventsWithStats.push({
          event,
          aceptedInvitationsNum: stats?.acceptedcount || 0,
          declinedInvitationsNum: stats?.declinedcount || 0,
          pendingInvitationsNum: stats?.pendingcount || 0,
        });
      }

      return eventsWithStats;
    } catch (error) {
      console.error('Error in getEventsWithStatistic:', error);
      throw new Error('Failed to fetch events with statistics.');
    }
  },
};
