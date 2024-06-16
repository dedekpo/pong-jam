import { RigidBody } from "@react-three/rapier";
import { useRefs } from "../contexts/RefsContext";

export default function Blocker() {
  const { ballApi } = useRefs();

  function ballHitBlocker() {
    if (!ballApi?.current) return;
    const ballVelocity = ballApi.current.linvel();
    const decreasedBallVelocity = {
      x: ballVelocity.x * 0.1,
      y: ballVelocity.y * 0.1,
      z: ballVelocity.z * 0.1,
    };
    ballApi.current.setLinvel(decreasedBallVelocity, true);
  }

  return (
    <RigidBody
      onContactForce={({ totalForceMagnitude }) => {
        if (totalForceMagnitude < 10) return;
        ballHitBlocker();
      }}
      type="fixed"
      canSleep={false}
      friction={0.9}
    >
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <boxGeometry args={[40, 2.4, 0.2]} />
        <meshStandardMaterial color="red" metalness={0.8} />
      </mesh>
    </RigidBody>
  );
}
