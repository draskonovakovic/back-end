import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); 

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10), 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
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
