import { Server as SocketIOServer } from 'socket.io';
import { jwtUtils } from './utilis/jwtUtilis';
import { handleEventNotifications } from './notifications';
import { scheduleEventNotifications } from './utilis/cronJobs';
import dotenv from 'dotenv';

dotenv.config();

const envFile = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env.local';
dotenv.config({ path: envFile });
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000').split(',');

export const initializeSocketIO = (server: any) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const authHeader = socket.handshake.headers.authorization;
    const token = jwtUtils.extractToken(authHeader);
  
    if (!token) {
      console.error('No token provided');
      return next(new Error('Authentication error'));
    }
  
    try {
      const user = jwtUtils.verifyToken(token);
      socket.data.user = user;
      next();
    } catch (error: any) {
      console.error('Token verification failed:', error.message);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.user);
  });

  const sendNotifications = handleEventNotifications(io);
  scheduleEventNotifications(sendNotifications);

  return io;
};
