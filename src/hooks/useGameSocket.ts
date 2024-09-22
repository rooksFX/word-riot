import { TileData } from "@/components/game/types";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | undefined;

const useGameSocket = () => {
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [opponentAction, setOpponentAction] = useState<TileData | null>(null);
  const [playerNumber, setPlayerNumber] = useState<1 | 2>();

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

    socket.on("opponentAction", (data: TileData, player) => {
      console.log(" --------- opponentAction > player | playerNumber: ", player , " | ", playerNumber);
      if (player === playerNumber) return;
      console.log(" --------- opponentAction > data: ", data);
      setOpponentAction(data);
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
      setPlayerNumber(1);
      console.log(" --------- playerNumber: ", 1);
      socket.emit("createGame", code);
    }
  };

  const joinGame = (code: string) => {
    if (socket) {
      setPlayerNumber(2);
      console.log(" --------- playerNumber: ", 2);
      socket.emit("joinGame", code);
    }
  };

  const sendAction = (data: TileData) => {
    if (socket) {
      console.log(" --------- sendAction > data: ", data);
      socket.emit("opponentAction", gameCode, data, playerNumber);
    }
  }

  return { gameCode, createGame, joinGame, sendAction, isGameStarted, opponentAction, error };
};

export default useGameSocket;
