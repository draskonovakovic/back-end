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
  
      const baseQuery = `
        SELECT id, title, description, date_time, location, creator_id, type, active
        FROM events
      `;
  
      const buildQuery = (
        query: string,
        condition: string,
        param: any
      ): [string, any[]] => {
        try {
          if (!condition || typeof condition !== 'string') {
            throw new Error('Invalid query condition provided.');
          }
          if (param === undefined || param === null) {
            throw new Error('Invalid parameter provided for query condition.');
          }
  
          const separator = query.includes('WHERE') ? ' AND' : ' WHERE';
          return [`${query}${separator} ${condition}`, [...param]];
        } catch (error: any) {
          throw createError(
            `Error building query: ${error.message}`,
            500
          );
        }
      };
  
      let query = baseQuery;
      let params: any[] = [];
  
      try {
        if (date) {
          [query, params] = buildQuery(
            query,
            `DATE(date_time) = $${params.length + 1}`,
            [...params, date]
          );
        }
  
        if (type) {
          [query, params] = buildQuery(
            query,
            `type = $${params.length + 1}`,
            [...params, type]
          );
        }
  
        if (active) {
          [query, params] = buildQuery(
            query,
            `active = CASE 
              WHEN $${params.length + 1} IN ('true', 'false') THEN $${params.length + 1}::BOOLEAN
              ELSE NULL
            END`,
            [...params, active]
          );
        }
  
        if (search) {
          [query, params] = buildQuery(
            query,
            `(title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1} OR location ILIKE $${params.length + 1})`,
            [...params, `%${search}%`]
          );
        }
      } catch (error: any) {
        throw createError(
          `Error while building query filters: ${error.message}`,
          500
        );
      }
  
      query += ' ORDER BY date_time DESC';
  
      try {
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
        throw createError(
          `Database query failed: ${error.message || 'Unknown error occurred.'}`,
          error.statusCode || 500
        );
      }
    } catch (error: any) {
      console.error('Error fetching filtered events:', error);
      throw createError(
        `Error filtering events: ${error.message || 'Unknown error occurred.'}`,
        error.statusCode || 500
      );
    }
  }    
};