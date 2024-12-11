import { sendEmail } from '../utilis/email';
import { Event } from '../models/event';

const API_URL = process.env.API_URL || 'http://localhost:5000';

export class emailService {
  static async sendInvitationEmail(to: string, event: Event, invitationId: number, loggedInUserId: number) {
    const acceptLink = `${API_URL}/api/invitations/${invitationId}/${loggedInUserId}/accept`;
    const declineLink = `${API_URL}/api/invitations/${invitationId}/decline`;

    const subject = `You're Invited: ${event.title}`;
    const text = `You have been invited to "${event.title}". Click the link to accept: ${acceptLink} or decline: ${declineLink}`;
    const html = `
      <p>You have been invited to <strong>${event.title}</strong>!</p>
      <p>
        <a href="${acceptLink}">Accept Invitation</a> |
        <a href="${declineLink}">Decline Invitation</a>
      </p>
      <p>We hope to see you there!</p>
    `;

    try {
      await sendEmail(to, subject, text, html);
      console.log(`Invitation email successfully sent to ${to} for event: ${event.title}`);
    } catch (error) {
      console.error('Error sending invitation email:', error);
      throw new Error('Failed to send invitation email. Please try again later.');
    }
  }
}
