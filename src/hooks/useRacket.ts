import { CollisionPayload, vec3 } from "@react-three/rapier";
import { useRefs } from "../contexts/RefsContext";
import { useGameStore } from "../stores/game-store";

export default function useRacket() {
  const { ballApi, racketApi, opponentApi } = useRefs();
  const setTouchedLastBy = useGameStore((state) => state.setTouchedLastBy);

  function getHitPrecision(distance: number) {
    if (distance < 1.3) return 1;
    if (distance < 2) return 0.5;
    return 0;
  }

  function racketHitBall(e: CollisionPayload) {
    const isPlayer = e.target.colliderObject?.name === "player-racket";
    setTouchedLastBy(isPlayer ? "player" : "opponent");

    const playeModifier = isPlayer ? -1 : 1;

    const racketWorldPosition = isPlayer
      ? vec3(racketApi?.current?.translation())
      : vec3(opponentApi?.current?.translation());

    const ballWorldPosition = vec3(ballApi?.current?.translation());

    const racketBallDistance =
      racketWorldPosition?.distanceTo(ballWorldPosition);

    const variationBasedOnPrecision =
      (Math.random() - 0.5) * getHitPrecision(racketBallDistance);

    const xVariation = variationBasedOnPrecision * 10;
    const yVariation = variationBasedOnPrecision * 1.5 + 3;

    ballApi?.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
    ballApi?.current?.setAngvel({ x: 0, y: 0, z: 0 }, true);
    ballApi?.current?.applyImpulse(
      { x: xVariation, y: yVariation, z: 15 * playeModifier },
      true
    );
  }

  return {
    racketHitBall,
  };
}
