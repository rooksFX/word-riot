"use client";
import { shuffle } from "lodash";
import { Data, TileData, SelectionResult } from "./types";
import { useEffect, useState } from "react";
import { Tile } from "./Tile";
import { AnimatePresence } from "framer-motion";
import { sleep } from "../../utils/sleep";
import "./game.styles.css";
// import { useWebSocket } from "../../hooks/useWebSocket";

interface Props {
  data: Data[];
  sendAction: (data: TileData) => void;
  disconnect: () => void;
  opponentAction: TileData | null;
  playerNumber: number | undefined;
  isSynonym: boolean;
}

const createCinnamonSquares = (data: Data[]) => {
  const cinnamonSquares = [];
  data.forEach((item) => {
    cinnamonSquares.push(item);
    const synonym: TileData = {
      word: item.synonym ?? "",
      synonym: item.word,
      antonym: item.antonym,
      hidden: false,
    };
    cinnamonSquares.push(synonym);
    const antonym: TileData = {
      word: item.antonym ?? "",
      synonym: item.antonym,
      antonym: item.antonym,
      hidden: false,
    };
    cinnamonSquares.push(antonym);
  });
  cinnamonSquares.push({
    word: "meow",
    synonym: null,
    antonym: null,
    hidden: false,
  });
  return cinnamonSquares;
};

// const cols = Array.from({ length: 4 }, (_, i) => i + 1);

const cols = [0, 4, 8, 12];

export const Game = ({
  data,
  sendAction,
  disconnect,
  opponentAction,
  isSynonym,
}: Props) => {
  // useWebSocket();

  const [cinnamonSquares, setCinnamonSquares] = useState(
    shuffle(createCinnamonSquares(data))
  );
  const [selectedWords, setSelectedWords] = useState<TileData[]>([]);
  const [result, setResult] = useState<SelectionResult>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [synonymsAnswered, setSynonymsAnswered] = useState(0);
  const [antonymsAnswered, setAnyonymsAnswered] = useState(0);

  useEffect(() => {
    (async () => {
      if (antonymsAnswered + synonymsAnswered === 5) {
        console.log(" --------- Game Completed ");
        if (antonymsAnswered < synonymsAnswered) {
          if (isSynonym) {
            console.log(" --------- Game Completed > You won!!! ");
          } else {
            console.log(" --------- Game Completed > You lose!!! ");
          }
        } else {
          if (isSynonym) {
            console.log(" --------- Game Completed > You lose!!! ");
          } else {
            console.log(" --------- Game Completed > You won!!! ");
          }
        }
        // end game
        await sleep(1200);
        disconnect();
      }
    })();
  }, [synonymsAnswered, antonymsAnswered]);

  useEffect(() => {
    if (opponentAction) onSelect(opponentAction, true);
  }, [opponentAction]);

  const onSelect = (data: TileData, fromOpponent = false) => {
    if (!fromOpponent) sendAction(data);
    if (selectedWords.includes(data)) {
      setSelectedWords([]);
    } else {
      setSelectedWords((prev) => [...prev, data]);
    }
  };

  const evaluate = async () => {
    if (selectedWords[1].word === selectedWords[0].synonym) {
      console.log(" evaluate > synonym ");
      setResult("synonyms");
      setSynonymsAnswered(synonymsAnswered + 1);
      await sleep(560);
      setIsAnimating(true);
      hideWord([
        selectedWords[0].word,
        selectedWords[0].synonym ?? "",
        selectedWords[0].antonym ?? "",
        selectedWords[1].word,
        selectedWords[1].synonym ?? "",
        selectedWords[1].antonym ?? "",
      ]);
    } else if (
      selectedWords[1].word === selectedWords[0].antonym ||
      selectedWords[1].antonym === selectedWords[0].word
    ) {
      console.log(" evaluate > antonym ");
      setResult("antonyms");
      setAnyonymsAnswered(antonymsAnswered + 1);
      await sleep(560);
      setIsAnimating(true);
      hideWord([
        selectedWords[0].word,
        selectedWords[0].synonym ?? "",
        selectedWords[0].antonym ?? "",
        selectedWords[1].word,
        selectedWords[1].synonym ?? "",
        selectedWords[1].antonym ?? "",
      ]);
    } else {
      console.log(" evaluate > incorrect ");
      await sleep(120);
      setIsAnimating(true);
      setResult("error");
    }
    await sleep(960);
    setIsAnimating(false);
    setSelectedWords([]);
    setResult(null);
  };

  useEffect(() => {
    if (selectedWords.length === 2) evaluate();
  }, [selectedWords]);

  const hideWord = (words: string[]) => {
    setCinnamonSquares((prev) => {
      const newCinnamonSquares = [...prev];
      newCinnamonSquares.forEach((cinnamon) => {
        if (words.includes(cinnamon.word)) {
          cinnamon.hidden = true;
        }
      });
      return newCinnamonSquares;
    });
  };

  const isSelected = (data: TileData) => {
    return selectedWords.some((word) => word.word === data.word);
  };

  return (
    <div className="min-w-[320px] w-[500px]">
      <div className="flex flex-row gap-2">
        {cols.map((col) => (
          <div key={col} className="w-[120px] h-[504px] flex flex-col gap-2">
            <AnimatePresence
              onExitComplete={() => setIsAnimating(false)}
              presenceAffectsLayout={true}
              mode="popLayout"
            >
              {/* 0 > 4, 3 > 8, 7 > 12, 11 > 16 */}
              {cinnamonSquares.slice(col, col + 4).map((cinnamon) =>
                !cinnamon.hidden ? (
                  <Tile
                    key={cinnamon.word}
                    data={cinnamon}
                    selectedWords={selectedWords}
                    onSelect={() => onSelect(cinnamon)}
                    isSelected={() => {
                      return isSelected(cinnamon);
                    }}
                    result={result}
                    isAnimating={isAnimating}
                    animationEnd={() => setIsAnimating(false)}
                  />
                ) : null
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <div className="mt-2">
        Synonyms: {synonymsAnswered}
        <br />
        Antonyms: {antonymsAnswered}
      </div>
    </div>
  );
};
