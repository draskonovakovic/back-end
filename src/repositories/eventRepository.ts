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

      if (result.rowCount === 0) {
        const checkQuery = `SELECT id, active FROM events WHERE id = $1`;
        const checkResult = await db.query(checkQuery, [id]);

        if (checkResult.rowCount === 0) {
          throw createError(
            `Failed to cancel event with ID ${id}. The record does not exist.`,
            404
          );
        }

        if (checkResult.rows[0].active === false) {
          throw createError(
            `Failed to cancel event with ID ${id}. The record is already canceled.`,
            400
          );
        }
      }

      return result.rows[0].id;
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred while canceling event';
      throw createError(`Error canceling event with with ID ${id}: ${errorMessage}`, 500);
    }
  },
};
