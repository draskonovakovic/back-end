import { baseRepository } from './baseRepository';
import { Event } from '../models/event';

export const eventRepository = {
  ...baseRepository<Event>('events'),
};
