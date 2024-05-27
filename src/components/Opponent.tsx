import PingPong from "../models/RacketMesh";
import { useRefs } from "../contexts/RefsContext";
import Racket from "./Racket";
import { useFrame } from "@react-three/fiber";
import { vec3 } from "@react-three/rapier";

export default function Opponent() {
  const { opponentApi, opponentMesh, ballApi } = useRefs();

  useFrame(() => {
    if (opponentApi?.current) {
      const currentOpponentPosition = vec3(opponentApi?.current?.translation());
      const ballPosition = vec3(ballApi?.current?.translation());
      const targetPosition = {
        x: ballPosition.x,
        y: Math.max(1, Math.min(3, ballPosition.y)), // Clamped within 1 and 3
        z: -30, // Presumably a fixed position on the z-axis
      };

      // Determine the interpolation speed factor
      const lerpFactor = 0.1; // Adjust this value based on desired responsiveness

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
      opponentApi?.current.setTranslation(interpolatedPosition, true);
    }
  });

  useFrame(() => {
    if (opponentMesh?.current) {
      const posistionX = vec3(opponentApi?.current?.translation()).x;
      opponentMesh.current.rotation.y = Math.PI * 2 - posistionX * -0.05;
    }
  });

  return (
    <Racket name="opponent-racket" ref={opponentApi} position={[0, 5, -30]}>
      <PingPong
        ref={opponentMesh}
        scale={[0.2, 0.2, 0.2]}
        rotation={[0, 0, Math.PI]}
        color="#4547bf"
      />
    </Racket>
  );
}
