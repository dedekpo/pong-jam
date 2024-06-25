import { RigidBody } from "@react-three/rapier";
import { useRefs } from "../contexts/RefsContext";
import { Trail } from "@react-three/drei";
import { useOnlineStore } from "../stores/online-store";
// import { useFrame } from "@react-three/fiber";

export default function Ball() {
  const { ballApi } = useRefs();

  const room = useOnlineStore((state) => state.room);

  return (
    <RigidBody
      ref={ballApi}
      ccd
      canSleep={false}
      colliders={"ball"}
      type={room ? "fixed" : "dynamic"}
      position={[0, 10, 30]}
      restitution={1}
      mass={0.1}
    >
      <Trail
        // width={touchedLastBy ? 10 : 0} // Width of the line
        width={10} // Width of the line
        color={"white"} // Color of the line
        length={2} // Length of the line
        decay={1} // How fast the line fades away
        local={false} // Wether to use the target's world or local positions
        stride={0} // Min distance between previous and current point
        interval={1} // Number of frames to wait before next calculation
        target={undefined} // Optional target. This object will produce the trail.
        attenuation={(width) => width} // A function to define the width in each point along it.
      >
        <mesh scale={[0.4, 0.4, 0.4]} position={[0, 0, 0]} castShadow>
          <sphereGeometry />
          <meshStandardMaterial color="#edce02" />
        </mesh>
      </Trail>
    </RigidBody>
  );
}
