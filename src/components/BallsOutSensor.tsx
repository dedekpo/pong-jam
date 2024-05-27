import { CuboidCollider } from "@react-three/rapier";
import { useGameStore } from "../stores/game-store";
import useGameController from "../hooks/useGameController";

export function BallOutSensor() {
  const { touchedLastBy, touchedLastTable } = useGameStore((state) => state);
  const { handlePlayerScore, handleOpponentScore } = useGameController();

  function handleBallOut() {
    if (touchedLastBy === "player") {
      if (touchedLastTable === "opponent") {
        handlePlayerScore();
        return;
      }
      handleOpponentScore();
      return;
    }

    if (touchedLastTable === "player") {
      handleOpponentScore();

      return;
    }
    handlePlayerScore();
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
