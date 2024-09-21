import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | undefined;

const useGameSocket = () => {
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) {
      socket = io({
        path: "/api/socket",
        // transports: ['polling', 'websocket'],
      });
    }

    console.log(" socket: ", socket);

    socket.on("connect", () => {
      console.log("Connected to server: ", socket);
    });

    socket.on("gameCreated", (code: string) => {
      setGameCode(code);
    });

    socket.on("gameJoined", (code: string) => {
      setGameCode(code);
    });

    socket.on("startGame", () => {
      setIsGameStarted(true);
    });

    socket.on("error", (msg: string) => {
      setError(msg);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const createGame = (code: string) => {
    if (socket) {
      socket.emit("createGame", code);
    }
  };

  const joinGame = (code: string) => {
    if (socket) {
      socket.emit("joinGame", code);
    }
  };

  return { gameCode, createGame, joinGame, isGameStarted, error };
};

export default useGameSocket;
