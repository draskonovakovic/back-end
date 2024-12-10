import cron from 'node-cron';
import db from './config/db';
import { createError } from './utilis/createError';

export const handleEventNotifications = (io: any) => {
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getNotificationDetails = (
    timeDiffHours: number,
    notificationsSent: Record<string, boolean | undefined>
  ) => {
    const notificationRules = [
      { threshold: 48, key: '2_days', message: 'starts in 2 days' },
      { threshold: 24, key: '1_day', message: 'starts in 1 day' },
      { threshold: 5, key: '5_hours', message: 'starts in less than 5 hours' },
      { threshold: 1, key: '1_hour', message: 'starts in less than an hour' },
    ];

    for (const { threshold, key, message } of notificationRules) {
      if (timeDiffHours <= threshold && !notificationsSent[key]) {
        return { key, message };
      }
    }

    return null;
  };

  const sendNotifications = async () => {
    const now = new Date();

    try {
      const result = await db.query(`
        SELECT id, title, date_time, notifications_sent
        FROM events
        WHERE date_time > NOW() - INTERVAL '2 days'
      `);

      if (!result.rows) {
        throw createError('No events found.', 404);
      }

      const events = result.rows;

      for (const event of events) {
        try {
          const eventTime = new Date(event.date_time);
          const timeDiffHours =
            (eventTime.getTime() - now.getTime()) / (1000 * 60 * 60);
          const notificationsSent = event.notifications_sent || {};

          const notificationDetails = getNotificationDetails(
            timeDiffHours,
            notificationsSent
          );

          if (notificationDetails) {
            const { key, message } = notificationDetails;
            const formattedMessage = `Event "${event.title}" ${message} at ${formatDate(
              eventTime
            )}.`;

            io.emit('event-reminder', { message: formattedMessage, event });

            await db.query(
              `
                UPDATE events
                SET notifications_sent = jsonb_set(
                  COALESCE(notifications_sent, '{}'),
                  '{${key}}',
                  'true'
                )
                WHERE id = $1
              `,
              [event.id]
            );
          }
        } catch (error: any) {
          throw createError('Error processing event:', error.statusCode || 500);
        }
      }
    } catch (error: any) {
      throw createError('Failed to send notifications.', error.statusCode || 500);
    }
  };

  cron.schedule('*/1 * * * *', async () => {
    console.log('Checking for upcoming event notifications...');
    try {
      await sendNotifications();
    } catch (error: any) {
      throw createError('Cron job error:', error.statusCode || 500);
    }
  });
};
