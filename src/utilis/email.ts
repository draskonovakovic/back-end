import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'haylie35@ethereal.email',
      pass: '33rfWydYp72Trjxm8y'
  }
});

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: '"Event App" <no-reply@eventapp.com>',
      to,
      subject,
      text,
      html,
    });

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
