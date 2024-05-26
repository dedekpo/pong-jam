import { useRefs } from "../contexts/RefsContext";
import { useGameStore, useScoreStore } from "../stores/game-store";

export default function useBall() {
  const { ballApi } = useRefs();
  const { touchedLastBy, setTouchedLastBy } = useGameStore((state) => state);
  const { setCanScore } = useScoreStore((state) => state);

  function handleResetBall(player?: "player" | "opponent") {
    const currentPlayer = player || touchedLastBy;
    const playerModifier = currentPlayer === "player" ? 1 : -1;

    setTouchedLastBy(undefined);
    setCanScore(true);

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
