import { sendEmail } from '../utilis/email';

export const emailService = {
  async sendInvitationEmail(to: string, event: any, token: string): Promise<void> {
    const acceptLink = `${process.env.API_URL}/api/invitations/accept?token=${token}`;
    const declineLink = `${process.env.API_URL}/api/invitations/decline?token=${token}`;
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
    await sendEmail(to, subject, text, html);
  },

  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    const subject = 'Password Reset Request';
    const text = `You have requested to reset your password. Click the link below to reset it:\n\n${resetLink}`;
    const html = `
      <p>You have requested to reset your password.</p>
      <p>
        <a href="${resetLink}">Reset Password</a>
      </p>
      <p>If you did not request this, please ignore this email.</p>
    `;
    await sendEmail(to, subject, text, html);
  },
};
