import http from 'http';
import app from './app';
import { initializeSocketIO } from './socket';
import { config } from './config/config';

const server = http.createServer(app);

export const io = initializeSocketIO(server);

server.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});
