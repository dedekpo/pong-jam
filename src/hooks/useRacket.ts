import { CollisionPayload, vec3 } from "@react-three/rapier";
import { useRefs } from "../contexts/RefsContext";
import { useGameStore } from "../stores/game-store";
import { pingAudio, pongAudio } from "../audios";

type PrecisionType = "PERFECT" | "GOOD" | "OK" | "BAD";

export default function useRacket() {
  const { ballApi, racketApi, opponentApi } = useRefs();
  const setTouchedLastBy = useGameStore((state) => state.setTouchedLastBy);

  function getHitPrecision(distance: number): {
    precision: PrecisionType;
    modifier: number;
    x: number;
    y: number;
    scalarMultiplier: number;
  } {
    const randomModifier = Math.random() - 0.5 > 0 ? 1 : -1;

    if (distance < 1.3)
      return {
        precision: "PERFECT",
        modifier: 0,
        x: -11 * randomModifier,
        y: 11,
        scalarMultiplier: 17,
      };
    if (distance < 2)
      return {
        precision: "GOOD",
        modifier: 0.3,
        x: -10 * randomModifier,
        y: 11,
        scalarMultiplier: 16,
      };
    if (distance < 3)
      return {
        precision: "OK",
        modifier: 0.5,
        x: -5 * randomModifier,
        y: 12,
        scalarMultiplier: 15,
      };
    return { precision: "BAD", modifier: 1, x: 0, y: 12, scalarMultiplier: 14 };
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

    const racketWorldPosition = isPlayer
      ? vec3(racketApi?.current?.translation())
      : vec3(opponentApi?.current?.translation());

    const ballWorldPosition = vec3(ballApi?.current?.translation());

    const racketBallDistance =
      racketWorldPosition?.distanceTo(ballWorldPosition);

    const precision = getHitPrecision(racketBallDistance);

    const targetPosition = vec3({
      x: precision.x,
      y: precision.y,
      z: 15 * playeModifier,
    });

    //Get direction from ball position to target position
    const direction = vec3({
      x: targetPosition.x - ballWorldPosition.x,
      y: targetPosition.y - ballWorldPosition.y,
      z: targetPosition.z - ballWorldPosition.z,
    })
      .normalize()
      .multiplyScalar(precision.scalarMultiplier);

    const variationBasedOnPrecision =
      (Math.random() - 0.5) * precision.modifier;

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
