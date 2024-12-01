import http from 'http';  
import app from './app';
import { Server as SocketIOServer } from 'socket.io';  
import { config } from './config/config'; 
import { jwtUtils } from './utilis/jwtUtilis';

const server = http.createServer(app);

export const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],        
    credentials: true,               
  },
});


io.use((socket, next) => {
  const authHeader = socket.handshake.headers.authorization; // Pristupi Authorization zaglavlju
  const token = authHeader?.split(' ')[1]; // Ekstraktuj token (format: "Bearer <token>")

  if (!token) {
    console.error('No token provided');
    return next(new Error('Authentication error'));
  }

  try {
    const user = jwtUtils.verifyToken(token); // Proveri validnost tokena
    socket.data.user = user; // Sačuvaj korisnika u socket instanci
    next();
  } catch (error: any) {
    console.error('Token verification failed:', error.message);
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.data.user);
});

server.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});
