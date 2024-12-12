import { baseRepository } from './baseRepository';
import { Invitation } from '../models/invitation';
import db from '../config/db';

export const invitationRepository = {
  ...baseRepository<Invitation>('invitations'),

  async getInvitationStatsByEventId(eventId: number) {
    const query = `
      SELECT
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) AS acceptedCount,
        SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END) AS declinedCount,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingCount
      FROM invitations
      WHERE event_id = $1
    `;
    const result = await db.query(query, [eventId]);
    return result.rows[0]; 
  },
};
