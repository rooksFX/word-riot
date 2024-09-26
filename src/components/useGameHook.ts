import { useEffect, useState } from 'react';
import io, { Socket }  from 'socket.io-client';
import { TileData } from './game/types';

/* eslint-disable @typescript-eslint/no-unused-vars */
let socket: Socket;

export const useGameHook = () => {
  const [gameCode, setGameCode] = useState('');
  const [isGameCreated, setIsGameCreated] = useState(false);
  const [isGameJoined, setIsGameJoined] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [playerMove, setPlayerMove] = useState('');
  const [opponentAction, setOpponentAction] = useState<TileData | null>(null);

  useEffect(() => {
    socket = io();

    socket.on('gameCreated', ({ gameCode }) => {
      setGameCode(gameCode);
      setIsGameCreated(true);
    });

    socket.on('gameJoined', () => {
      setIsGameJoined(true);
    });

    socket.on('startGame', () => {
      console.log('Game started!');
    });

    socket.on('opponentAction', (data: TileData) => {
      console.log('Opponent action:', data);
      setOpponentAction(data);
    });

    socket.on('error', (error) => {
      setErrorMessage(error);
    });

    return () => {
      socket && socket.disconnect();
    };
  }, []);

  const createGame = () => {
    socket.emit('createGame');
  };

  const joinGame = () => {
    socket.emit('joinGame', gameCode);
  };

  const sendAction = (data: TileData) => {
    socket.emit('playerAction', gameCode, data);
    // setPlayerMove(action);
  };

  return {
    gameCode,
    isGameCreated,
    isGameJoined,
    errorMessage,
    playerMove,
    opponentAction,
    setGameCode,
    createGame,
    joinGame,
    sendAction,
  }
}