import { useRefs } from "../contexts/RefsContext";

export default function useBall() {
  const { ballApi } = useRefs();
  function handleResetBall(player: "player" | "opponent") {
    const playerModifier = player === "player" ? 1 : -1;

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
