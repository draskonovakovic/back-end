import http from 'http';  
import app from './app';
import { Server as SocketIOServer } from 'socket.io';  
import { config } from './config/config'; 

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

server.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});
