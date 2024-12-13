import { baseRepository } from './baseRepository';
import { Event } from '../models/event';
import db from '../config/db';
import { createError } from '../utilis/createError';
import { VALID_EVENT_TYPES } from '../config/eventTypes';

export const eventRepository = {
  ...baseRepository<Event>('events'),

  async findEventsByCreatorId(creatorId: number): Promise<Event[]> {
    try {
      const query = `SELECT * FROM events WHERE creator_id = $1`;
      const result = await db.query(query, [creatorId]);

      if (!result || result.rows.length === 0) {
        throw createError(
          `Failed to find record by creator id ${creatorId} in table "events". The database query returned no result.`,
          404
        );
      }

      return result.rows;
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred while retrieving the record';
      throw createError(`Error finding record by creator id in table "events": ${errorMessage}`, 500);
    }
  },

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
    active?: string;
    search?: string;
  }): Promise<Event[]> {
    try {
      const { date, type, active, search } = filters;
  
      if (date && isNaN(Date.parse(date))) {
        throw createError('Invalid date format provided in filters', 400);
      }
  
      if (type && !VALID_EVENT_TYPES.includes(type)) {
        throw createError(
          `Invalid event type provided. Valid types are: ${VALID_EVENT_TYPES.join(', ')}`,
          400
        );
      }
  
      let query = `
        SELECT id, title, description, date_time, location, creator_id, type, active
        FROM events
      `;
      const params: (string | boolean)[] = [];
      const conditions: string[] = []; 
  
      if (date) {
        conditions.push(`DATE(date_time) = $${params.length + 1}`);
        params.push(date);
      }
  
      if (type) {
        conditions.push(`type = $${params.length + 1}`);
        params.push(type);
      }
  
      if (active) {
        conditions.push(`active = CASE 
            WHEN $${params.length + 1} IN ('true', 'false') THEN $${params.length + 1}::BOOLEAN
            ELSE NULL
          END`);
        params.push(active);
      }
  
      if (search) {
        conditions.push(`(title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1} OR location ILIKE $${params.length + 1})`);
        params.push(`%${search}%`);
      }
  
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
  
      query += ` ORDER BY date_time DESC`;
  
      const result = await db.query(query, params);
  
      if (!result) {
        throw createError('Query execution failed. No result returned.', 500);
      }
  
      if (!Array.isArray(result.rows)) {
        throw createError('Unexpected result format. Expected an array of rows.', 500);
      }
  
      if (result.rowCount === 0) {
        throw createError('No events found matching the provided filters.', 404);
      }
  
      return result.rows;
    } catch (error: any) {
      console.error('Error fetching filtered events:', error);
      throw createError(
        `Error filtering events: ${error.message || 'Unknown error occurred.'}`,
        error.statusCode || 500
      );
    }
  }
    
};
