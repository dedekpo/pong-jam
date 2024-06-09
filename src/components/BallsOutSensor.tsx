import { CuboidCollider } from "@react-three/rapier";
import { useGameStore } from "../stores/game-store";
import useGameController from "../hooks/useGameController";
import { useOnlineStore } from "../stores/online-store";
import { useRefs } from "../contexts/RefsContext";

export function BallOutSensor() {
  const { touchedLastBy, touchedLastTable } = useGameStore((state) => state);
  const { handleScore } = useGameController();
  const { room } = useOnlineStore((state) => state);
  const { playerIsHandlingBall } = useRefs();

  function handleBallOut() {
    if (playerIsHandlingBall.current) {
      room?.send("balls-out");
    }

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
