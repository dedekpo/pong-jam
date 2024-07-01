import { create } from "zustand/react";
import { PowerUpsType } from "./power-up-store";

interface BallState {
  powerUp: PowerUpsType | undefined;
  setPowerUp: (powerUp: PowerUpsType | undefined) => void;
  showTrail: boolean;
  setShowTrail: (showTrail: boolean) => void;
}

export const useBallStore = create<BallState>()((set) => ({
  powerUp: undefined,
  setPowerUp: (powerUp) => set({ powerUp }),
  showTrail: false,
  setShowTrail: (showTrail) => set({ showTrail }),
}));
