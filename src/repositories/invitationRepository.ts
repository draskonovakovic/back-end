import { baseRepository } from './baseRepository';
import { Invitation } from '../models/invitation';
import db from '../config/db';
import { createError } from '../utilis/createError';

export const invitationRepository = {
  ...baseRepository<Invitation>('invitations'),

  async getInvitationStatsByEventId(eventId: number) {
    try {
      if (!eventId || typeof eventId !== 'number' || eventId <= 0) {
        throw createError('Invalid or missing eventId', 400);
      }
      
      const query = `
        SELECT
          SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) AS acceptedCount,
          SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END) AS declinedCount,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingCount
        FROM invitations
        WHERE event_id = $1
      `;
      const result = await db.query(query, [eventId]);

      if (!result || result.rows.length === 0) {
        throw createError(`No invitations found for event with ID ${eventId}`, 404);
      }

      return result.rows[0]; 
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred generating stats';
      throw createError(`Error generating invitation stats: ${errorMessage}`, 500);
    }
  },
};
