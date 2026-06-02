"use client";

import { Domino } from "@/lib/domino";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

type GameContextValue = {
  selectedDomino: Domino | undefined;
  setSelectedDomino: (domino?: Domino) => void;
};

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [selectedDomino, setSelectedDomino] = useState<Domino | undefined>();

  return (
    <GameContext.Provider
      value={{
        selectedDomino,
        setSelectedDomino,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);

  if (context === undefined) {
    throw new Error("useGame must be used inside GameProvider");
  }

  return context;
}