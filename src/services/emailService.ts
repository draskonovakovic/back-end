import { sendEmail } from '../utilis/email';

export class emailService {
  static async sendInvitationEmail(to: string, eventTitle: string, invitationId: number) {
    const acceptLink = `http://localhost:5000/api/invitations/${invitationId}/accept`;
    const declineLink = `http://localhost:5000/api/invitations/${invitationId}/decline`;

    const subject = `You're Invited: ${eventTitle}`;
    const text = `You have been invited to "${eventTitle}". Click here to accept: ${acceptLink} or decline: ${declineLink}`;
    const html = `
      <p>You have been invited to <strong>${eventTitle}</strong>!</p>
      <p>
        <a href="${acceptLink}">Accept Invitation</a> |
        <a href="${declineLink}">Decline Invitation</a>
      </p>
    `;

    console.log("Usao je u mail service")

    try {
      await sendEmail(to, subject, text, html);
    } catch (error) {
      console.error('Error sending invitation email:', error);
      throw error;
    }
  }
}
