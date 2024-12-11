import cron from 'node-cron';

export const scheduleEventNotifications = (sendNotifications: () => Promise<void>) => {
  cron.schedule('*/1 * * * *', async () => {
    console.log('Checking for upcoming event notifications...');
    try {
      await sendNotifications();
    } catch (error: any) {
      console.error('Cron job error:', error.message);
    }
  });
};
