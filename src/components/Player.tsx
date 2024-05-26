import { useFrame } from "@react-three/fiber";
import { useRefs } from "../contexts/RefsContext";
import { TABLE_WIDTH } from "../config";
import PingPong from "../models/RacketMesh";
import Racket from "./Racket";
import { vec3 } from "@react-three/rapier";
import useTouchPosition from "../hooks/useTouchPosition";

export default function Player() {
  const { racketApi, racketMesh, ballApi } = useRefs();
  const mousePosition = useTouchPosition();

  useFrame(() => {
    if (racketApi?.current) {
      const currentPosition = racketApi?.current.translation();
      const targetPosition = {
        x: mousePosition.xPercent * 0.5 - TABLE_WIDTH / 2 - 5,
        y: mousePosition.yPercent * -0.1 + 10,
        z: currentPosition.z, // assuming z remains constant
      };

      // Determine the interpolation speed factor
      const lerpFactor = 0.1; // Adjust this value to change the smoothness

      // Calculate the interpolated position
      const interpolatedPosition = {
        x:
          currentPosition.x +
          lerpFactor * (targetPosition.x - currentPosition.x),
        y:
          currentPosition.y +
          lerpFactor * (targetPosition.y - currentPosition.y),
        z:
          currentPosition.z +
          lerpFactor * (targetPosition.z - currentPosition.z),
      };

      // Set the new interpolated position
      racketApi?.current.setTranslation(interpolatedPosition, true);
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
