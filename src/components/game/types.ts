export interface Data {
  word: string;
  synonym: string | null;
  antonym: string | null;
}

export interface TileData extends Data {
  hidden: boolean;
}

export type SelectionResult = "synonyms" | "antonyms" | "error" | null;