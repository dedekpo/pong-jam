import { PowerUpsType } from "./stores/power-up-store";

export const TABLE_WIDTH = 40;

export const precisionPositions = {
  playerLeft: [-10, 2, 15],
  playerCenter: [0, 2, 15],
  playerRight: [10, 2, 15],
  oponnentLeft: [-10, 2, -15],
  oponnentCenter: [0, 2, -15],
  oponnentRight: [10, 2, -15],
};

export const powerUpNames: PowerUpsType[] = [
  "super-hit",
  "super-curve",
  "increase-size",
  "slow-motion",
  "camera-shake",
];

export const SECONDS_TO_RESPAWN_POWER_UP = 5;
