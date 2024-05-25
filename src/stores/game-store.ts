import { create } from "zustand";

type Players = "player" | "opponent";

interface GameState {
  touchedLastBy: Players;
  setTouchedLastBy: (by: Players) => void;
  touchedLastTable: Players;
  setTouchedLastTable: (table: Players) => void;
}

export const useGameStore = create<GameState>()((set) => ({
  touchedLastBy: "player",
  setTouchedLastBy: (player) => set({ touchedLastBy: player }),
  touchedLastTable: "player",
  setTouchedLastTable: (table) => set({ touchedLastTable: table }),
}));

interface ScoreState {
  opponentScore: number;
  playerScore: number;
  increaseOpponentScore: (score: number) => void;
  increasePlayerScore: (score: number) => void;
}

export const useScoreStore = create<ScoreState>()((set) => ({
  opponentScore: 0,
  playerScore: 0,
  increaseOpponentScore: (score) =>
    set((state) => ({ opponentScore: state.opponentScore + score })),
  increasePlayerScore: (score) =>
    set((state) => ({ playerScore: state.playerScore + score })),
}));
