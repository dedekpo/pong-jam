import { create } from "zustand";
import { persist } from "zustand/middleware";

type Players = "player" | "opponent";

type GameStateType =
  | "MENU"
  | "FRIENDLY-MENU"
  | "SEARCHING-ONLINE"
  | "PLAYING-ONLINE"
  | "PLAYING-VS-AI"
  | "END-GAME-ONLINE"
  | "END-GAME-VS-AI";

interface GameControllerState {
  isGameStarted: boolean;
  setIsGameStarted: (isGameStarted: boolean) => void;
  gameState: GameStateType;
  setGameState: (gameState: GameStateType) => void;
}

export const useGameControllerStore = create<GameControllerState>()((set) => ({
  isGameStarted: false,
  setIsGameStarted: (isGameStarted) => set({ isGameStarted }),
  gameState: "MENU",
  setGameState: (gameState) => set({ gameState }),
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
  playerWon: boolean;
  setPlayerWon: (playerWon: boolean) => void;
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
  playerWon: false,
  setPlayerWon: (playerWon) => set({ playerWon }),
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

export const usePaddleStore = create<PaddleState>()(
  persist(
    (set) => ({
      playerColor: "#d94c51",
      opponentColor: "#4547bf",
      setPlayerColor: (color) => set({ playerColor: color }),
      setOpponentColor: (color) => set({ opponentColor: color }),
    }),
    { name: "player-colors" }
  )
);

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
