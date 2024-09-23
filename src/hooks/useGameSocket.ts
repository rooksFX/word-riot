import { TileData } from "@/components/game/types";
import { random, set } from "lodash";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | undefined;

const useGameSocket = () => {
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [opponentAction, setOpponentAction] = useState<TileData | null>(null);
  const [playerNumber, setPlayerNumber] = useState<1 | 2>();
  const [isSynonym, setIsSynonym] = useState(false);

  useEffect(() => {
    if (!socket) {
      socket = io({
        path: "/api/socket",
        // transports: ['polling', 'websocket'],
      });
    }

    socket.on("connect", () => {
      console.log("Connected to server: ", socket);
    });

    socket.on("gameCreated", (code: string) => {
      setGameCode(code);
    });

    socket.on("gameJoined", (code: string, isSynonymRandomized: boolean) => {
      setIsSynonym(isSynonymRandomized);
      setGameCode(code);
    });

    socket.on("startGame", () => {
      setIsGameStarted(true);
    });

    socket.on("opponentAction", (data: TileData, player) => {
      if (player === playerNumber) return;
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
      const isSynonymRandomized = random(0, 1) === 1;
      setIsSynonym(isSynonymRandomized);
      socket.emit("createGame", code, isSynonymRandomized);
    }
  };

  const joinGame = (code: string) => {
    if (socket) {
      setPlayerNumber(2);
      socket.emit("joinGame", code);
    }
  };

  const sendAction = (data: TileData) => {
    if (socket) {
      socket.emit("opponentAction", gameCode, data, playerNumber);
    }
  };

  const disconnect = () => {
    if (socket) {
      setGameCode(null);
      setIsGameStarted(false);
      socket.disconnect();
    }
  }

  return {
    gameCode,
    createGame,
    joinGame,
    sendAction,
    disconnect,
    isGameStarted,
    opponentAction,
    playerNumber,
    isSynonym,
    error,
  };
};

export default useGameSocket;
