import { useMemo, useRef } from "react";
import { selectSound } from "../../audios";
import { powerUpNames } from "../../config";
import { useOnlineStore } from "../../stores/online-store";
import {
  usePowerUpObjectStore,
  usePowerUpStore,
} from "../../stores/power-up-store";
import { getRandomNumberBetween } from "../../utils";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useRefs } from "../../contexts/RefsContext";
import * as THREE from "three";
import { vec3 } from "@react-three/rapier";

export default function PowerUpObject() {
  const { room } = useOnlineStore();
  const { setP1PowerUp, setP1State } = usePowerUpStore();
  const { setDisplayPowerUp, powerUpPosition } = usePowerUpObjectStore();
  const { racketApi } = useRefs();

  function handleGrabPowerUp() {
    selectSound.play();

    setP1State("spinning");

    const randomPowerUp =
      powerUpNames[getRandomNumberBetween(0, powerUpNames.length - 1)];

    setDisplayPowerUp(false);

    if (room) {
      room.send("grabbed-power-up", randomPowerUp);
    }

    setTimeout(() => {
      setP1PowerUp(randomPowerUp);
      setP1State("showing");

      if (room) {
        room.send("power-up-ready");
      }

      switch (randomPowerUp) {
        case "increase-size":
          racketMesh?.current?.scale.set(0.4, 0.4, 0.4);
          racketApi?.current
            ?.collider(0)
            .setHalfExtents(vec3({ x: 4.5, y: 0.3, z: 5 }));

          setTimeout(() => {
            racketMesh?.current?.scale.set(0.2, 0.2, 0.2);
            racketApi?.current
              ?.collider(0)
              .setHalfExtents(vec3({ x: 2.2, y: 0.3, z: 2.4 }));
            setP1PowerUp(undefined);
            setP1State("none");
          }, 8 * 1000);

          break;
        case "camera-shake":
          setTimeout(() => {
            setP1PowerUp(undefined);
            setP1State("none");
          }, 8 * 1000);
          break;
        case "slow-motion":
          setTimeout(() => {
            setP1PowerUp(undefined);
            setP1State("none");
          }, 10 * 1000);
          break;
      }
    }, 2 * 1000);
  }

  const displayPowerUpRef = useRef(false);
  const powerUpRef = useRef<THREE.Group>(null);
  const powerUpScale = useRef(0);
  const cubeRef = useRef<THREE.Group>(null);
  const { racketMesh } = useRefs();

  const [auxVec, auxVec2] = useMemo(() => {
    return [new THREE.Vector3(), new THREE.Vector3()];
  }, []);

  useFrame(() => {
    if (!cubeRef?.current || !racketMesh?.current) return;
    const playerPosition = racketMesh.current.getWorldPosition(auxVec);
    const cubePosition = cubeRef.current.getWorldPosition(auxVec2);
    const distance = cubePosition.distanceTo(playerPosition);

    if (distance < 3) {
      handleGrabPowerUp();
      if (room) {
        room.send("remove-power-up");
      }
    }
  });

  useFrame((_, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta * 1.5;
      cubeRef.current.rotation.y += delta * 1.5;
    }

    if (
      powerUpRef.current &&
      powerUpScale.current < 1 &&
      displayPowerUpRef.current
    ) {
      powerUpScale.current = powerUpScale.current + 1 * delta;

      powerUpRef.current.scale.set(
        powerUpScale.current,
        powerUpScale.current,
        powerUpScale.current
      );
    }
  });

  return (
    <group
      ref={powerUpRef}
      position={[
        powerUpPosition?.x || 0,
        powerUpPosition?.y || 0,
        powerUpPosition?.z || 0,
      ]}
    >
      <Sparkles scale={1} size={20} color={"yellow"} speed={2} />
      <group ref={cubeRef}>
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <boxGeometry args={[0.75, 0.75, 0.75]} />
          <meshStandardMaterial color="#ff3b69" metalness={0.8} />
        </mesh>
        {/* Second cube pointing downwards */}
        <mesh rotation={[-Math.PI / 4, -Math.PI / 4, 0]}>
          <boxGeometry args={[0.75, 0.75, 0.75]} />
          <meshStandardMaterial color="#ff3b69" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
