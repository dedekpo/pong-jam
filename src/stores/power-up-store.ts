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

interface PowerUpState {
  displayPowerUp: boolean;
  setDisplayPowerUp: (displayPowerUp: boolean) => void;
  powerUpPosition: PositionType;
  setPowerUpPosition: (position: PositionType) => void;
  selectedPowerUp: PowerUpsType | undefined;
  setSelectedPowerUp: (powerUp: PowerUpsType | undefined) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
  ballPowerUp: PowerUpsType | undefined;
  setBallPowerUp: (powerUp: PowerUpsType | undefined) => void;
}

export const usePowerUpStore = create<PowerUpState>()((set) => ({
  displayPowerUp: false,
  setDisplayPowerUp: (displayPowerUp) => set({ displayPowerUp }),
  powerUpPosition: { x: 0, y: 0, z: 0 },
  setPowerUpPosition: (position) => set({ powerUpPosition: position }),
  selectedPowerUp: undefined,
  setSelectedPowerUp: (powerUp) => set({ selectedPowerUp: powerUp }),
  isModalOpen: false,
  setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
  isActive: false,
  setIsActive: (isActive) => set({ isActive }),
  ballPowerUp: undefined,
  setBallPowerUp: (powerUp) => set({ ballPowerUp: powerUp }),
}));
