import cron from 'node-cron';
import db from './config/db';

export const handleEventNotifications = (io: any) => {
  const sendNotifications = async () => {
    const now = new Date();
    const result = await db.query(`
        SELECT id, title, date_time, notifications_sent
        FROM events
        WHERE date_time > NOW() - INTERVAL '2 days' 
    `);

    const events = result.rows;

    const formatDate = (date: Date): string => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    };

    for (const event of events) {
        const eventTime = new Date(event.date_time);
        const timeDiffMs = eventTime.getTime() - now.getTime();
        const timeDiffHours = timeDiffMs / (1000 * 60 * 60); 
        const notificationsSent = event.notifications_sent || {};

        let message: string | null = null;
        let key: string | null = null;

        if (timeDiffHours <= 48 && timeDiffHours > 24 && !notificationsSent['2_days']) {
            message = `Event "${event.title}" starts in 2 days at ${formatDate(eventTime)}.`;
            key = '2_days';
        } else if (timeDiffHours <= 24 && timeDiffHours > 5 && !notificationsSent['1_day']) {
            message = `Event "${event.title}" starts in 1 day at ${formatDate(eventTime)}.`;
            key = '1_day';
        } else if (timeDiffHours <= 5 && timeDiffHours > 1 && !notificationsSent['5_hours']) {
            message = `Event "${event.title}" starts in less than 5 hours at ${formatDate(eventTime)}.`;
            key = '5_hours';
        } else if (timeDiffHours <= 1 && timeDiffHours > 0 && !notificationsSent['1_hour']) {
            message = `Event "${event.title}" starts in less than an hour at ${formatDate(eventTime)}.`;
            key = '1_hour';
        } 
        
        if (message && key) {
            io.emit('event-reminder', { message, event });

            await db.query(`
                UPDATE events
                SET notifications_sent = jsonb_set(
                    COALESCE(notifications_sent, '{}'),
                    '{${key}}',
                    'true'
                )
                WHERE id = $1
            `, [event.id]);
        }
    }
  };

  cron.schedule('*/1 * * * *', () => {
    console.log('Checking for upcoming event notifications...');
    sendNotifications().catch((err) => {
      console.error('Error while sending event notifications:', err);
    });
  });
};
