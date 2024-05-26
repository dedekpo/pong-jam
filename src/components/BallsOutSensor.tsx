import { CuboidCollider } from "@react-three/rapier";
import useBall from "../hooks/useBall";
import { useGameStore, useScoreStore } from "../stores/game-store";

export function BallOutSensor() {
  const { handleResetBall } = useBall();

  const { touchedLastBy, touchedLastTable } = useGameStore((state) => state);
  const { increaseOpponentScore, increasePlayerScore } = useScoreStore(
    (state) => state
  );
  function handleBallOut() {
    handleResetBall();

    if (touchedLastBy === "player") {
      if (touchedLastTable === "opponent") {
        increasePlayerScore(1);
        return;
      }
      increaseOpponentScore(1);
      return;
    }

    if (touchedLastTable === "player") {
      increaseOpponentScore(1);

      return;
    }
    increasePlayerScore(1);
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
