import { CollisionPayload, vec3 } from "@react-three/rapier";
import { useRefs } from "../contexts/RefsContext";
import { useGameStore } from "../stores/game-store";
import { pingAudio, pongAudio } from "../audios";

export default function useRacket() {
  const { ballApi, racketApi, opponentApi } = useRefs();
  const setTouchedLastBy = useGameStore((state) => state.setTouchedLastBy);

  function getHitPrecision(distance: number) {
    if (distance < 1.3) return 0;
    if (distance < 2) return 0.5;
    return 1;
  }

  function racketHitBall(e: CollisionPayload) {
    const isPlayer = e.target.colliderObject?.name === "player-racket";
    setTouchedLastBy(isPlayer ? "player" : "opponent");

    if (isPlayer) {
      pingAudio.play();
    } else {
      pongAudio.play();
    }

    const playeModifier = isPlayer ? -1 : 1;
    const randomModifier = Math.random() - 0.5 > 0 ? 1 : -1;

    const racketWorldPosition = isPlayer
      ? vec3(racketApi?.current?.translation())
      : vec3(opponentApi?.current?.translation());

    const ballWorldPosition = vec3(ballApi?.current?.translation());

    const racketBallDistance =
      racketWorldPosition?.distanceTo(ballWorldPosition);

    const precision = getHitPrecision(racketBallDistance);

    const targetPosition = vec3({
      x: precision === 0 ? -10 * randomModifier : 0,
      y: 12,
      z: 15 * playeModifier,
    });

    const scalarMultiplier = precision === 0 ? 17 : 16;

    //Get direction from ball position to target position
    const direction = vec3({
      x: targetPosition.x - ballWorldPosition.x,
      y: targetPosition.y - ballWorldPosition.y,
      z: targetPosition.z - ballWorldPosition.z,
    })
      .normalize()
      .multiplyScalar(scalarMultiplier);

    const variationBasedOnPrecision = (Math.random() - 0.5) * precision;

    const xVariation = variationBasedOnPrecision * 10;
    const yVariation = variationBasedOnPrecision * 1.5;

    ballApi?.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
    ballApi?.current?.setAngvel({ x: 0, y: 0, z: 0 }, true);
    ballApi?.current?.applyImpulse(
      {
        x: direction.x + xVariation,
        y: direction.y + yVariation,
        z: direction.z,
      },
      true
    );
  }

  return {
    racketHitBall,
  };
}
