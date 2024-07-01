import { CameraShake, Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRefs } from "../contexts/RefsContext";
import { getRandomNumberBetween } from "../utils";
import { SECONDS_TO_RESPAWN_POWER_UP, powerUpNames } from "../config";
import { usePowerUpStore } from "../stores/power-up-store";
import { vec3 } from "@react-three/rapier";
import { selectSound } from "../audios";

export default function PowerUps() {
  const {
    displayPowerUp,
    setPowerUpPosition,
    setDisplayPowerUp,
    isActive,
    isModalOpen,
  } = usePowerUpStore();

  const isActiveRef = useRef(isActive);
  const displayPowerUpRef = useRef(displayPowerUp);
  const isModalOpenRef = useRef(displayPowerUp);

  useEffect(() => {
    isActiveRef.current = isActive;
    displayPowerUpRef.current = displayPowerUp;
    isModalOpenRef.current = isModalOpen;
  }, [isActive, displayPowerUp, isModalOpen]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        !displayPowerUpRef.current &&
        !isActiveRef.current &&
        !isModalOpenRef.current
      ) {
        const modifier = Math.random() - 0.5 > 0 ? 1 : -1;
        setPowerUpPosition({
          x: 10 * modifier,
          y: getRandomNumberBetween(1, 10),
          z: 30,
        });
        setDisplayPowerUp(true);
      }
      return () => clearInterval(interval);
    }, SECONDS_TO_RESPAWN_POWER_UP * 1000);
  }, []);

  return (
    <>
      <ActivePowerUps />
      {displayPowerUp && <PowerUpObject />}
    </>
  );
}

function PowerUpObject() {
  const {
    displayPowerUp,
    setDisplayPowerUp,
    powerUpPosition,
    selectedPowerUp,
    setSelectedPowerUp,
    setIsModalOpen,
    setIsActive,
  } = usePowerUpStore();

  function handleGrabPowerUp() {
    selectSound.play();

    setDisplayPowerUp(false);
    setIsModalOpen(true);
    const randomPowerUp =
      powerUpNames[getRandomNumberBetween(0, powerUpNames.length - 1)];

    // const pseudoRandom = "super-curve";

    setSelectedPowerUp(randomPowerUp);

    switch (randomPowerUp) {
      case "camera-shake":
        setTimeout(() => {
          setSelectedPowerUp(undefined);
          setIsActive(false);
        }, 8 * 1000);
        break;
      case "slow-motion":
        setTimeout(() => {
          setSelectedPowerUp(undefined);
          setIsActive(false);
        }, 10 * 1000);
        break;
    }
  }

  const displayPowerUpRef = useRef(false);
  const selectedPowerUpRef = useRef(selectedPowerUp);
  const powerUpRef = useRef<THREE.Group>(null);
  const powerUpScale = useRef(0);
  const cubeRef = useRef<THREE.Group>(null);
  const { racketMesh } = useRefs();

  const [auxVec, auxVec2] = useMemo(() => {
    return [new THREE.Vector3(), new THREE.Vector3()];
  }, []);

  useEffect(() => {
    displayPowerUpRef.current = displayPowerUp;
    selectedPowerUpRef.current = selectedPowerUp;

    return () => {
      powerUpRef.current?.scale.set(0, 0, 0);
      powerUpScale.current = 0;
    };
  }, [displayPowerUp, selectedPowerUp]);

  useFrame(() => {
    if (!cubeRef?.current || !racketMesh?.current) return;
    const playerPosition = racketMesh.current.getWorldPosition(auxVec);
    const cubePosition = cubeRef.current.getWorldPosition(auxVec2);
    const distance = cubePosition.distanceTo(playerPosition);

    if (distance < 3) {
      handleGrabPowerUp();
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
      position={[powerUpPosition.x, powerUpPosition.y, powerUpPosition.z]}
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

function ActivePowerUps() {
  const { selectedPowerUp, setSelectedPowerUp, isActive, setIsActive } =
    usePowerUpStore();
  const { racketMesh, racketApi } = useRefs();

  useEffect(() => {
    if (selectedPowerUp && isActive) {
      switch (selectedPowerUp) {
        case "increase-size":
          racketMesh?.current?.scale.set(0.4, 0.4, 0.4);
          racketApi?.current
            ?.collider(0)
            .setHalfExtents(vec3({ x: 4.5, y: 0.2, z: 5 }));
          setTimeout(() => {
            racketMesh?.current?.scale.set(0.2, 0.2, 0.2);
            racketApi?.current
              ?.collider(0)
              .setHalfExtents(vec3({ x: 2.2, y: 0.2, z: 2.4 }));
            setSelectedPowerUp(undefined);
            setIsActive(false);
          }, 5 * 1000);
          break;
      }
    }
  }, [selectedPowerUp, isActive]);

  return (
    <>
      {selectedPowerUp === "camera-shake" && isActive && <CameraShakePowerUp />}
      <SlowMotionPowerUp
        isActive={selectedPowerUp === "slow-motion" && isActive}
      />
    </>
  );
}

function CameraShakePowerUp() {
  return (
    <CameraShake
      maxYaw={0.1} // Max amount camera can yaw in either direction
      maxPitch={0.1} // Max amount camera can pitch in either direction
      maxRoll={0.1} // Max amount camera can roll in either direction
      yawFrequency={1} // Frequency of the the yaw rotation
      pitchFrequency={1} // Frequency of the pitch rotation
      rollFrequency={1} // Frequency of the roll rotation
      intensity={1} // initial intensity of the shake
      decayRate={0.65} // if decay = true this is the rate at which intensity will reduce at
    />
  );
}

function SlowMotionPowerUp({ isActive }: { isActive: boolean }) {
  const { clock } = useThree();
  const isActiveRef = useRef(isActive);
  const isClockRunningRef = useRef(true);
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useFrame(() => {
    if (isActiveRef.current) {
      if (isClockRunningRef.current) {
        clock.stop();
        isClockRunningRef.current = false;
      } else {
        clock.start();
        isClockRunningRef.current = true;
      }
      return;
    }

    if (!isClockRunningRef.current) {
      clock.start();
      isClockRunningRef.current = true;
    }
  });

  return null;
}
