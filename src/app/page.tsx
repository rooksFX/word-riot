"use client";
import { Lobby } from "@/components/lobby/Lobby";
import { patchUrlMappings } from '@discord/embedded-app-sdk';
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    patchUrlMappings([{prefix: '/api/socket/', target: 'https://word-riot.onrender.com/api/socket/'}]);
  }, [])
  

  return (
    <div className="w-dvw h-dvh flex justify-center items-center bg-slate-800 border border-red-700">
      <Lobby />
    </div>
  );
}
