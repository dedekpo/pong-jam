import { useRefs } from "../contexts/RefsContext";
import { useBallStore } from "../stores/ball-store";
import { useGameStore, useScoreStore } from "../stores/game-store";

export default function useBall() {
  const { ballApi } = useRefs();
  const { touchedLastBy, setTouchedLastBy, setTouchedLastTable } = useGameStore(
    (state) => state
  );
  const { setCanScore } = useScoreStore((state) => state);
  const { setShowTrail } = useBallStore();

  function handleResetBall(player?: "player" | "opponent") {
    const currentPlayer = player || touchedLastBy;
    const playerModifier = currentPlayer === "player" ? 1 : -1;

    setTouchedLastBy(undefined);
    setTouchedLastTable(undefined);
    setCanScore(true);
    setShowTrail(false);

    ballApi?.current?.resetForces(true);
    ballApi?.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
    ballApi?.current?.setAngvel({ x: 0, y: 0, z: 0 }, true);
    ballApi?.current?.setTranslation(
      { x: 0, y: 10, z: 30 * playerModifier },
      true
    );
  }

  return {
    handleResetBall,
  };
}
