import { baseRepository } from './baseRepository';
import { Event } from '../models/event';
import db from '../config/db';
import { createError } from '../utilis/createError';
import { VALID_EVENT_TYPES } from '../config/eventTypes';

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
  
  generateEventQuery(filters: {
    date?: string;
    type?: string;
    active?: string;
    search?: string;
  }): { query: string; params: any[] } {
    const { date, type, active, search } = filters;
  
    if (date && !type && !active) {
      return {
        query: `
          SELECT id, title, description, date_time, location, creator_id, type, active
          FROM events
          WHERE DATE(date_time) = $1
          ${search ? `AND (title ILIKE $2 OR description ILIKE $2 OR location ILIKE $2)` : ''}
          ORDER BY date_time DESC
        `,
        params: search ? [date, `%${search}%`] : [date],
      };
    }
  
    if (type && !date && !active) {
      return {
        query: `
          SELECT id, title, description, date_time, location, creator_id, type, active
          FROM events
          WHERE type = $1
          ${search ? `AND (title ILIKE $2 OR description ILIKE $2 OR location ILIKE $2)` : ''}
          ORDER BY date_time DESC
        `,
        params: search ? [type, `%${search}%`] : [type],
      };
    }
  
    if (!type && !date && active) {
      return {
        query: `
          SELECT id, title, description, date_time, location, creator_id, type, active
          FROM events
          WHERE active = CASE 
            WHEN $1 IN ('true', 'false') THEN $1::BOOLEAN
            ELSE NULL
          END
          ${search ? `AND (title ILIKE $2 OR description ILIKE $2 OR location ILIKE $2)` : ''}
          ORDER BY date_time DESC
        `,
        params: search ? [active, `%${search}%`] : [active],
      };
    }
  
    if (!type && date && active) {
      return {
        query: `
          SELECT id, title, description, date_time, location, creator_id, type, active
          FROM events
          WHERE DATE(date_time) = $1
          AND active = CASE 
            WHEN $2 IN ('true', 'false') THEN $2::BOOLEAN
            ELSE NULL
          END
          ${search ? `AND (title ILIKE $3 OR description ILIKE $3 OR location ILIKE $3)` : ''}
          ORDER BY date_time DESC
        `,
        params: search ? [date, active, `%${search}%`] : [date, active],
      };
    }
  
    if (type && !date && active) {
      return {
        query: `
          SELECT id, title, description, date_time, location, creator_id, type, active
          FROM events
          WHERE type = $1
          AND active = CASE 
            WHEN $2 IN ('true', 'false') THEN $2::BOOLEAN
            ELSE NULL
          END
          ${search ? `AND (title ILIKE $3 OR description ILIKE $3 OR location ILIKE $3)` : ''}
          ORDER BY date_time DESC
        `,
        params: search ? [type, active, `%${search}%`] : [type, active],
      };
    }
  
    if (type && date && !active) {
      return {
        query: `
          SELECT id, title, description, date_time, location, creator_id, type, active
          FROM events
          WHERE type = $1
          AND DATE(date_time) = $2
          ${search ? `AND (title ILIKE $3 OR description ILIKE $3 OR location ILIKE $3)` : ''}
          ORDER BY date_time DESC
        `,
        params: search ? [type, date, `%${search}%`] : [type, date],
      };
    }
  
    if (type && date && active) {
      return {
        query: `
          SELECT id, title, description, date_time, location, creator_id, type, active
          FROM events
          WHERE type = $1
          AND DATE(date_time) = $2
          AND active = CASE 
            WHEN $3 IN ('true', 'false') THEN $3::BOOLEAN
            ELSE NULL
          END
          ${search ? `AND (title ILIKE $4 OR description ILIKE $4 OR location ILIKE $4)` : ''}
          ORDER BY date_time DESC
        `,
        params: search ? [type, date, active, `%${search}%`] : [type, date, active],
      };
    }
  
    return {
      query: `
        SELECT id, title, description, date_time, location, creator_id, type, active
        FROM events
        ${search ? `WHERE (title ILIKE $1 OR description ILIKE $1 OR location ILIKE $1)` : ''}
        ORDER BY date_time DESC
      `,
      params: search ? [`%${search}%`] : [],
    };
  },  

  async getFilteredEvents(filters: {
    date?: string;
    type?: string;
    active?: string;
    search?: string;
  }): Promise<Event[]> {
    try {
      const { date, type } = filters;

      if (date && isNaN(Date.parse(date))) {
        throw createError('Invalid date format provided in filters', 400);
      }
      if (type && !VALID_EVENT_TYPES.includes(type)) {
        throw createError(
          `Invalid event type provided. Valid types are: ${VALID_EVENT_TYPES.join(', ')}`,
          400
        );
      }

      const { query, params } = this.generateEventQuery(filters);
      const result = await db.query(query, params);

      return this.validateQueryResult(result);
    } catch (error: any) {
      console.error('Error fetching filtered events:', error);
      throw createError(
        `Error filtering events: ${error.message || 'Unknown error occurred.'}`,
        error.statusCode || 500
      );
    }
  },
    
  validateQueryResult(result: any): Event[] {
    if (!result) {
      throw createError('Query execution failed. No result returned.', 500);
    }
  
    if (!Array.isArray(result.rows)) {
      throw createError('Unexpected result format. Expected an array of rows.', 500);
    }
  
    return result.rows;
  },  
};
