import { baseRepository } from './baseRepository';
import { Event } from '../models/event';
import db from '../config/db';
import { createError } from '../utilis/createError';

export const eventRepository = {
  ...baseRepository<Event>('events'),

  async cancelEvent(id: number): Promise<number> {
    try {
      const query = `
        UPDATE events
        SET active = false
        WHERE id = $1 AND active = true
        RETURNING id
      `;
      const result = await db.query(query, [id]);
  
      if (result.rowCount != 0) {
        return result.rows[0].id;
      }
  
      const checkQuery = `SELECT id, active FROM events WHERE id = $1`;
      const checkResult = await db.query(checkQuery, [id]);
  
      if (checkResult.rowCount === 0) {
        throw createError(
          `Failed to cancel event with ID ${id}. The record does not exist.`,
          404
        );
      }
  
      if (!checkResult.rows[0].active) {
        throw createError(
          `Failed to cancel event with ID ${id}. The record is already canceled.`,
          400
        );
      }
  
      throw createError(
        `Failed to cancel event with ID ${id} due to an unknown reason.`,
        500
      );
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred while canceling event';
      throw createError(`Error canceling event with ID ${id}: ${errorMessage}`, 500);
    }
  }, 
  
  async getFilteredEvents(filters: {
    date?: string;
    type?: string;
    location?: string;
    search?: string;
  }): Promise<Event[]> {
    try {
      const { date, type, location, search } = filters;
  
      let query = `
        SELECT id, title, description, date_time, location, creator_id, type, active
        FROM events
        WHERE active = true
      `;
      const params: any[] = [];
  
      if (date) {
        query += ` AND DATE(date_time) = $${params.length + 1}`;
        params.push(date);
      }
  
      if (type) {
        query += ` AND type = $${params.length + 1}`;
        params.push(type);
      }
  
      if (location) {
        query += ` AND location = $${params.length + 1}`;
        params.push(location);
      }
  
      if (search) {
        query += ` AND (title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1} OR location ILIKE $${params.length + 1})`;
        params.push(`%${search}%`);
      }
  
      query += ` ORDER BY date_time DESC`;
  
      const result = await db.query(query, params);
  
      if (result.rowCount === 0) {
        throw createError('No events found with the provided filters.', 404);
      }
  
      return result.rows;
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred while filtering events';
      throw createError(`Error filtering events: ${errorMessage}`, error.statusCode);
    }
  }  
};
