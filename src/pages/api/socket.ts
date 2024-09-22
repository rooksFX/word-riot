import { Server as IOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as HTTPServer } from 'http';
import { Socket } from 'net';

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface ExtendedNextApiResponse extends NextApiResponse {
  socket: Socket & { server: SocketServer };
}

export default function handler(req: NextApiRequest, res: ExtendedNextApiResponse) {
  if (!res.socket.server.io) {
    const io = new IOServer(res.socket.server, {
      path: "/api/socket",  // Set the path explicitly
      // transports: ['polling', 'websocket'],
    });
    res.socket.server.io = io;

    console.log('Socket.io established');

    io.on('connection', (socket) => {
      console.log('New player connected:', socket.id);

      socket.on('connect_error', (err) => {
        console.error('Connection error:', err);
      });

      // Create a game room
      socket.on('createGame', (gameCode: string) => {
        socket.join(gameCode);
        console.log(`Game room ${gameCode} created by ${socket.id}`);
        socket.emit('gameCreated', gameCode);
      });

      // Join an existing game room
      socket.on('joinGame', (gameCode: string) => {
        const room = io.sockets.adapter.rooms.get(gameCode);
        if (room && room.size === 1) {
          socket.join(gameCode);
          console.log(`${socket.id} joined game room ${gameCode}`);
          socket.emit('gameJoined', gameCode);
          io.to(gameCode).emit('startGame');  // Notify both players to start the game
        } else {
          socket.emit('error', 'Game room not available or already full');
        }
      });

      socket.on('opponentAction', (gameCode: string, data: any, playerNumber: 1 | 2) => {
        console.log(" --------- opponentAction > data: ", data);
        console.log(" --------- opponentAction > playerNumber: ", playerNumber);
        socket.to(gameCode).emit('opponentAction', data, playerNumber);
      });

      socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
      });
    });
  } else {
    console.log('Socket.io server already running');
  }
  res.end();
}
