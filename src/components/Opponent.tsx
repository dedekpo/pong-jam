import PingPong from "../models/RacketMesh";
import { useRefs } from "../contexts/RefsContext";
import Racket from "./Racket";
import { useFrame } from "@react-three/fiber";
import { vec3 } from "@react-three/rapier";

export default function Opponent() {
  const { opponentApi, opponentMesh, ballApi } = useRefs();

  useFrame(() => {
    if (opponentApi?.current) {
      const ballPosition = vec3(ballApi?.current?.translation());

      opponentApi?.current.setTranslation(
        {
          x: ballPosition.x,
          // Set max and min to prevent opponent from going out of the table
          y: Math.max(1, Math.min(3, ballPosition.y)),
          z: -30,
        },
        true
      );
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
