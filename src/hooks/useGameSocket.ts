import { TileData } from "@/components/game/types";
import { random } from "lodash";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | undefined;

// const protocol = `https`;
// const clientId = "1292011849470054471";
// const proxyDomain = "discordsays.com";
// const resourcePath = "/api/socket";
// const url = new URL(
//   `${protocol}://${clientId}.${proxyDomain}/.proxy${resourcePath}`
// );

const useGameSocket = () => {
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [opponentAction, setOpponentAction] = useState<TileData | null>(null);
  const [playerNumber, setPlayerNumber] = useState<1 | 2>();
  const [isSynonym, setIsSynonym] = useState(false);

  useEffect(() => {
    if (!socket) {
      // replace the URL w/ the deployed Web Sockets server
      // or use envi variable and make the URL dynamic
      // socket = io(`${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}`, {
      // path: "/socket",
      // socket = io(`${url}`, {
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

  const leaveGame = () => {
    if (socket) {
      setGameCode(null);
      setIsGameStarted(false);
      socket.emit("leave", gameCode);
    }
  };

  const disconnect = () => {
    if (socket) {
      setGameCode(null);
      setIsGameStarted(false);
      socket.disconnect();
    }
  };

  return {
    gameCode,
    createGame,
    joinGame,
    sendAction,
    disconnect,
    leaveGame,
    isGameStarted,
    opponentAction,
    playerNumber,
    isSynonym,
    error,
  };
};

export default useGameSocket;
