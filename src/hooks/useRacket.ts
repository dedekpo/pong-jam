import { vec3 } from "@react-three/rapier";
import { useRefs } from "../contexts/RefsContext";
import { useGameStore } from "../stores/game-store";
import { useOnlineStore } from "../stores/online-store";
import { usePowerUpStore } from "../stores/power-up-store";
import { useBallStore } from "../stores/ball-store";

type PrecisionType = "PERFECT" | "GOOD" | "OK" | "BAD";

export default function useRacket() {
  const { ballApi, racketApi, opponentApi, playerIsHandlingBall } = useRefs();
  const setTouchedLastBy = useGameStore((state) => state.setTouchedLastBy);
  const { room } = useOnlineStore((state) => state);
  const { p1PowerUp, setP1PowerUp, setP1State } = usePowerUpStore();
  const { powerUp, setPowerUp, showTrail, setShowTrail } = useBallStore();

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
        y: 10,
        scalarMultiplier: 18,
      };
    if (distance < 2)
      return {
        precision: "GOOD",
        modifier: 0.3,
        x: -10 * randomModifier,
        y: 12,
        scalarMultiplier: 17,
      };
    if (distance < 3)
      return {
        precision: "OK",
        modifier: 0.5,
        x: -5 * randomModifier,
        y: 13,
        scalarMultiplier: 16,
      };
    return { precision: "BAD", modifier: 1, x: 0, y: 13, scalarMultiplier: 14 };
  }

  function racketHitBall(isPlayer: boolean) {
    setTouchedLastBy(isPlayer ? "player" : "opponent");

    if (isPlayer && playerIsHandlingBall.current) {
      room?.send("hit-ball");
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

    ballApi?.current?.resetForces(true);
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

    if (powerUp) {
      setPowerUp(undefined);
    }
    if (!showTrail) {
      setShowTrail(true);
    }

    if (isPlayer && p1PowerUp === "super-curve") {
      ballApi?.current?.addForce(
        {
          x: targetPosition.x > 0 ? -8 : 8,
          y: 0,
          z: 0,
        },
        true
      );
      setP1PowerUp(undefined);
      setPowerUp("super-curve");
      setTimeout(() => {
        setP1State("none");
      }, 1 * 1000);
      return;
    }

    if (isPlayer && p1PowerUp === "super-hit") {
      ballApi?.current?.addForce(
        {
          x: 0,
          y: -4,
          z: 18 * playeModifier,
        },
        true
      );
      setP1PowerUp(undefined);
      setPowerUp("super-hit");
      setTimeout(() => {
        setP1State("none");
      }, 1 * 1000);
      return;
    }
  }

  return {
    racketHitBall,
  };
}
