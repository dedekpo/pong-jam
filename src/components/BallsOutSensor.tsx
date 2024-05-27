import { CuboidCollider } from "@react-three/rapier";
import { useGameStore } from "../stores/game-store";
import useGameController from "../hooks/useGameController";

export function BallOutSensor() {
  const { touchedLastBy, touchedLastTable } = useGameStore((state) => state);
  const { handleScore } = useGameController();

  function handleBallOut() {
    if (touchedLastBy === "player") {
      if (touchedLastTable === "opponent") {
        handleScore("player");
        return;
      }
      handleScore("opponent");
      return;
    }

    if (touchedLastTable === "player") {
      handleScore("opponent");

      return;
    }
    handleScore("player");
  }

  return (
    <CuboidCollider
      onIntersectionEnter={handleBallOut}
      sensor
      args={[200, 3, 200]}
      position={[0, -15, 0]}
    />
  );
}
