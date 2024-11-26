import dotenv from 'dotenv';
import http from 'http';  
import app from './app';
import { Server as SocketIOServer } from 'socket.io';  

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new SocketIOServer(server);

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('message', (msg) => {
    console.log('Received message:', msg);
    io.emit('message', msg);  
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
