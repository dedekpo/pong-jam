import { create } from "zustand/react";

type PositionType = {
  x: number;
  y: number;
  z: number;
};

export type PowerUpsType =
  | "super-hit"
  | "super-curve"
  | "increase-size"
  | "slow-motion"
  | "camera-shake";

type PowerUpStateType = "none" | "spinning" | "showing";

interface PowerUpState {
  p1PowerUp: PowerUpsType | undefined;
  p2PowerUp: PowerUpsType | undefined;
  setP1PowerUp: (powerUp: PowerUpsType | undefined) => void;
  setP2PowerUp: (powerUp: PowerUpsType | undefined) => void;
  p1State: PowerUpStateType;
  p2State: PowerUpStateType;
  setP1State: (state: PowerUpStateType) => void;
  setP2State: (state: PowerUpStateType) => void;
}

export const usePowerUpStore = create<PowerUpState>()((set) => ({
  p1PowerUp: undefined,
  p2PowerUp: undefined,
  setP1PowerUp: (powerUp) => set({ p1PowerUp: powerUp }),
  setP2PowerUp: (powerUp) => set({ p2PowerUp: powerUp }),
  p1State: "none",
  p2State: "none",
  setP1State: (state) => set({ p1State: state }),
  setP2State: (state) => set({ p2State: state }),
}));

interface PowerUpObject {
  displayPowerUp: boolean;
  setDisplayPowerUp: (displayPowerUp: boolean) => void;
  powerUpPosition: PositionType | undefined;
  setPowerUpPosition: (position: PositionType | undefined) => void;
}

export const usePowerUpObjectStore = create<PowerUpObject>()((set) => ({
  displayPowerUp: false,
  setDisplayPowerUp: (displayPowerUp) => set({ displayPowerUp }),
  powerUpPosition: undefined,
  setPowerUpPosition: (position) => set({ powerUpPosition: position }),
}));

interface OpponentState {
  powerUpPosition: PositionType | undefined;
  setPowerUpPosition: (position: PositionType | undefined) => void;
}

export const useOpponentStore = create<OpponentState>()((set) => ({
  powerUpPosition: undefined,
  setPowerUpPosition: (position) => set({ powerUpPosition: position }),
}));
