import {
  useOpponentStore,
  usePowerUpObjectStore,
} from "../../stores/power-up-store";
import OpponentPowerUp from "../OpponentPowerUp";
import ActivePowerUps from "./ActivePowerUps";
import ObjectSpawner from "./ObjectSpawner";
import PowerUpObject from "./PowerUpObject";

export default function PowerUp() {
  const { displayPowerUp } = usePowerUpObjectStore();
  const { powerUpPosition } = useOpponentStore();

  return (
    <>
      {displayPowerUp && <PowerUpObject />}
      <ObjectSpawner />
      <ActivePowerUps />
      {powerUpPosition && <OpponentPowerUp powerUpPosition={powerUpPosition} />}
    </>
  );
}
