import { useFrame } from "@react-three/fiber";
import useMousePosition from "../hooks/useMousePosition";
import { useRefs } from "../contexts/RefsContext";
import { TABLE_WIDTH } from "../config";
import PingPong from "../models/RacketMesh";
import Racket from "./Racket";
import { vec3 } from "@react-three/rapier";

export default function Player() {
  const { racketApi, racketMesh, ballApi } = useRefs();
  const mousePosition = useMousePosition();

  useFrame(() => {
    if (racketApi?.current) {
      const currentPosition = racketApi?.current.translation();
      racketApi?.current.setTranslation(
        {
          x: mousePosition.xPercent * 0.5 - TABLE_WIDTH / 2 - 5,
          y: mousePosition.yPercent * -0.1 + 10,
          z: currentPosition.z,
        },
        true
      );
    }

    if (racketMesh?.current && ballApi?.current && racketApi?.current) {
      const ballPosition = vec3(ballApi.current.translation());
      const distance = ballPosition.distanceTo(racketApi.current.translation());

      let rotationY = Math.PI * -0.5 - mousePosition.xPercent * -0.03;
      let rotationX = 0;

      if (distance < 5) {
        rotationX = ((-Math.PI / 5) * (5 - distance)) / 5;
      } else {
        rotationX = 0;
      }

      racketMesh.current.rotation.y = rotationY;
      racketMesh.current.rotation.x = rotationX;
    }
  });
  return (
    <Racket name="player-racket" ref={racketApi} position={[0, 5, 30]}>
      <PingPong ref={racketMesh} scale={[0.2, 0.2, 0.2]} color="#d94c51" />
    </Racket>
  );
}
