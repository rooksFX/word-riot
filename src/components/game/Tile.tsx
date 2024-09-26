import { easeInOut, motion } from "framer-motion";
import { TileData, SelectionResult } from "./types";
import { random } from "lodash";

interface Prop {
  data: TileData;
  selectedWords: TileData[];
  onSelect: () => void;
  isSelected: () => boolean;
  result: SelectionResult;
  isAnimating: boolean;
  animationEnd: () => void;
}

export const Tile = ({
  data,
  selectedWords,
  onSelect,
  isSelected,
  result,
  isAnimating,
  animationEnd,
}: Prop) => {

  if (data.word === "bright") console.log(" --------- Tile: bright > selectedWords.includes(data): ", selectedWords.includes(data));
  if (data.word === "bright") console.log(" --------- Tile: bright > selectedWords[0]: ", selectedWords[0]);
  if (data.word === "bright") console.log(" --------- Tile: bright > data: ", data);

  const bgColor = () => {
    switch (result) {
      case "synonyms":
        return "bg-emerald-500 text-zinc-100";
      case "antonyms":
        return "bg-amber-500 text-zinc-100";
      case "error":
        return "error bg-rose-900 text-zinc-100";
      default:
        return "bg-white text-zinc-800";
    }
  };

  return (
    <motion.button
      className={`
        size-[120px]
        rounded-md
        overflow-hidden
        text-lg
        font-bold
        transition-colors
        hover:brightness-110
        ${isSelected() ? bgColor() : "bg-indigo-500 text-zinc-100"}
        ${!isSelected() && isAnimating ? "saturate-0 hover:cursor-not-allowed": ""}
      `}
      onClick={onSelect}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: [1.2, 0], borderRadius: ["6px", "50%"], opacity: 0 }}
      transition={{
        duration: random(0.18, 0.56),
        ease: easeInOut,
        bounceStiffness: 100,
      }}
      layout
      //   onLayoutAnimationStart={() => console.log('onLayoutAnimationStart')}
      //   onLayoutAnimationComplete={() => console.log('onLayoutAnimationComplete')}
      onAnimationEnd={animationEnd}
      disabled={isAnimating}
    >
      {data.word}
    </motion.button>
  );
};