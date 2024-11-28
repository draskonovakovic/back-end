import http from 'http';  
import app from './app';
import { Server as SocketIOServer } from 'socket.io';  
import { config } from './config/config'; 
import { jwtUtils } from './utilis/jwtUtilis';

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],        
    credentials: true,               
  },
});


io.use((socket, next) => {
  const token = socket.handshake.headers.cookie
    ?.split('; ')
    .find((row) => row.startsWith('auth_token='))
    ?.split('=')[1];

  if (!token) return next(new Error('Authentication error'));

  try {
    const user = jwtUtils.verifyToken(token);
    socket.data.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.data.user);
});

server.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});
