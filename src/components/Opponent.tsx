import PingPong from "../models/RacketMesh";
import { useRefs } from "../contexts/RefsContext";
import Racket from "./Racket";
import { useFrame } from "@react-three/fiber";
import { vec3 } from "@react-three/rapier";
import { clamp } from "three/src/math/MathUtils.js";
import { useOnlineStore } from "../stores/online-store";
import { usePaddleStore } from "../stores/game-store";
import { useMemo } from "react";

export default function Opponent() {
  const { opponentApi, opponentMesh, ballApi } = useRefs();
  const { room } = useOnlineStore((state) => state);
  const { opponentColor } = usePaddleStore((state) => state);

  useFrame((_, delta) => {
    if (room) return; // Is online mode
    if (opponentApi?.current) {
      const currentOpponentPosition = vec3(opponentApi?.current?.translation());
      const ballPosition = vec3(ballApi?.current?.translation());
      const targetPosition = {
        x: clamp(ballPosition.x, -25, 25),
        y: clamp(ballPosition.y, 1, 5), // Clamped within 1 and 3
        z: -30, // Presumably a fixed position on the z-axis
      };

      // Determine the interpolation speed factor
      const lerpFactor = 5 * delta; // Adjust this value based on desired responsiveness

      // Calculate the interpolated position
      const interpolatedPosition = {
        x:
          currentOpponentPosition.x +
          lerpFactor * (targetPosition.x - currentOpponentPosition.x),
        y:
          currentOpponentPosition.y +
          lerpFactor * (targetPosition.y - currentOpponentPosition.y),
        z:
          currentOpponentPosition.z +
          lerpFactor * (targetPosition.z - currentOpponentPosition.z),
      };

      // Set the new interpolated position
      opponentApi?.current.setNextKinematicTranslation(interpolatedPosition);
    }
  });

  const auxVec = useMemo(() => vec3(), []);

  useFrame(() => {
    if (opponentMesh?.current) {
      const posistionX = opponentMesh.current.getWorldPosition(auxVec).x;
      opponentMesh.current.rotation.y = Math.PI * 2 - posistionX * -0.05;
    }
  });

  return (
    <Racket name="opponent-racket" ref={opponentApi} position={[0, 5, -30]}>
      <PingPong
        ref={opponentMesh}
        scale={[0.2, 0.2, 0.2]}
        rotation={[0, 0, Math.PI]}
        color={opponentColor}
      />
    </Racket>
  );
}
