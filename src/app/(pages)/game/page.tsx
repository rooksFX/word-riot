import { Game } from "@/components/game/Game";
import React from "react";
import { data } from "@/components/game/data";

const page = () => {
  return (
    <div className="w-dvw h-dvh flex justify-center items-center bg-slate-800 border border-red-700">
      <Game data={data.slice(0, 5)} />
    </div>
  );
};

export default page;
