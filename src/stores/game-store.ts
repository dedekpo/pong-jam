import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface ConfettiState {
  isConfettiActive: boolean;
  setIsConfettiActive: (isConfettiActive: boolean) => void;
}

export const useConfettiStore = create<ConfettiState>()((set) => ({
  isConfettiActive: false,
  setIsConfettiActive: (isConfettiActive) => set({ isConfettiActive }),
}));

interface PaddleState {
  playerColor: string;
  opponentColor: string;
  setPlayerColor: (color: string) => void;
  setOpponentColor: (color: string) => void;
}

export const usePaddleStore = create<PaddleState>()((set) => ({
  playerColor: "#d94c51",
  opponentColor: "#4547bf",
  setPlayerColor: (color) => set({ playerColor: color }),
  setOpponentColor: (color) => set({ opponentColor: color }),
}));

interface GamificationProps {
  victories: number;
  addVictory: () => void;
}

export const useGamificationStore = create<GamificationProps>()(
  persist(
    (set) => ({
      victories: 0,
      addVictory: () => set((state) => ({ victories: state.victories + 1 })),
    }),
    { name: "gamification" }
  )
);

interface NameProps {
  playerName: string;
  setPlayerName: (newName: string) => void;
  opponentName: string;
  setOpponentName: (newName: string) => void;
}

export const useNamesStore = create<NameProps>()(
  persist(
    (set) => ({
      playerName: "Player",
      setPlayerName: (newName) => set(() => ({ playerName: newName })),
      opponentName: "",
      setOpponentName: (newName) => set(() => ({ opponentName: newName })),
    }),
    { name: "names" }
  )
);
