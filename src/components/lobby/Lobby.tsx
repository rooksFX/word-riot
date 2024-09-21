"use client";
import { useState } from 'react';
import useGameSocket from '@/hooks/useGameSocket';

export const Lobby = () => {
  const [inputCode, setInputCode] = useState('');
  const { createGame, joinGame, gameCode, isGameStarted, error } = useGameSocket();

  const handleCreateGame = () => {
    const code = Math.random().toString(36).substr(2, 5).toUpperCase();
    createGame(code);
  };

  const handleJoinGame = () => {
    joinGame(inputCode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {!gameCode && !isGameStarted && (
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleCreateGame}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Create Game
          </button>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter game code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="border rounded p-2"
            />
            <button
              onClick={handleJoinGame}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Join Game
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}
        </div>
      )}

      {gameCode && !isGameStarted && (
        <p className="text-xl font-semibold">
          Waiting for the second player... Game Code: {gameCode}
        </p>
      )}

      {isGameStarted && (
        <div>
          <h2 className="text-2xl font-bold">Game Started!</h2>
          <p className="text-gray-700">Both players are now connected.</p>
          {/* Game UI goes here */}
        </div>
      )}
    </div>
  );
};
