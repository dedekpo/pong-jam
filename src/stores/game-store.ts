import { create } from "zustand";

type Players = "player" | "opponent";

interface GameControllerState {
  isGameStarted: boolean;
  setIsGameStarted: (isGameStarted: boolean) => void;
}

export const useGameControllerStore = create<GameControllerState>()((set) => ({
  isGameStarted: false,
  setIsGameStarted: (isGameStarted) => set({ isGameStarted }),
}));

interface GameState {
  touchedLastBy: Players | undefined;
  setTouchedLastBy: (by: Players | undefined) => void;
  touchedLastTable: Players | undefined;
  setTouchedLastTable: (table: Players | undefined) => void;
}

export const useGameStore = create<GameState>()((set) => ({
  touchedLastBy: undefined,
  setTouchedLastBy: (player) => set({ touchedLastBy: player }),
  touchedLastTable: "player",
  setTouchedLastTable: (table) => set({ touchedLastTable: table }),
}));

interface ScoreState {
  opponentScore: number;
  playerScore: number;
  increaseOpponentScore: (score: number) => void;
  increasePlayerScore: (score: number) => void;
  canScore: boolean;
  setCanScore: (canScore: boolean) => void;
  resetScores: () => void;
}

export const useScoreStore = create<ScoreState>()((set) => ({
  opponentScore: 0,
  playerScore: 0,
  increaseOpponentScore: (score) =>
    set((state) => ({ opponentScore: state.opponentScore + score })),
  increasePlayerScore: (score) =>
    set((state) => ({ playerScore: state.playerScore + score })),
  canScore: true,
  setCanScore: (canScore) => set({ canScore }),
  resetScores: () => set({ playerScore: 0, opponentScore: 0 }),
}));
