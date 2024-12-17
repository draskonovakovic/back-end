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
          let notificationsSent = event.notifications_sent || {};
  
          const notificationRules = [
            { threshold: 1, key: '1_hour', message: 'starts in less than an hour' },
            { threshold: 5, key: '5_hours', message: 'starts in less than 5 hours' },
            { threshold: 24, key: '1_day', message: 'starts in 1 day' },
            { threshold: 48, key: '2_days', message: 'starts in 2 days' },
          ];
  
          const closestNotification = notificationRules.find(
            ({ threshold, key }) => timeDiffHours <= threshold && !notificationsSent[key]
          );
  
          if (closestNotification) {
            const { key, message } = closestNotification;
  
            const formattedMessage = `Event "${event.title}" ${message} at ${formatDate(
              eventTime
            )}.`;
  
            io.emit('event-reminder', { message: formattedMessage, event });
  
            const updatedNotifications = { ...notificationsSent };
            for (const { threshold, key: ruleKey } of notificationRules) {
              if (threshold >= closestNotification.threshold) {
                updatedNotifications[ruleKey] = true;
              }
            }
  
            await db.query(
              `
                UPDATE events
                SET notifications_sent = $1
                WHERE id = $2
              `,
              [updatedNotifications, event.id]
            );
          }
        } catch (error: any) {
          console.error('Error processing event:', error.message);
        }
      }
    } catch (error: any) {
      console.error('Failed to send notifications.', error.message);
    }
  };
    

  return sendNotifications; 
};
