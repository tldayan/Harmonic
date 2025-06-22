import { io } from 'socket.io-client';

const socket = io('https://myharmonic-dev.app', {
  path: '/api/social/socket.io',
  transports: ['websocket'],
  autoConnect: false,
  reconnection: true,                  // enable automatic reconnection
  reconnectionAttempts: Infinity,     // unlimited tries
  reconnectionDelay: 2000,            // wait 2 seconds before trying again
  timeout: 10000,                     // 10 sec connection timeout
});

export default socket;
