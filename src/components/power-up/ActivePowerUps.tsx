import { useEffect, useRef } from "react";
import { usePowerUpStore } from "../../stores/power-up-store";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraShake } from "@react-three/drei";

export default function ActivePowerUps() {
  const { p1PowerUp } = usePowerUpStore();

  return (
    <>
      {p1PowerUp === "camera-shake" && <CameraShakePowerUp />}
      <SlowMotionPowerUp isActive={p1PowerUp === "slow-motion"} />
    </>
  );
}

function CameraShakePowerUp() {
  return (
    <CameraShake
      maxYaw={0.1} // Max amount camera can yaw in either direction
      maxPitch={0.1} // Max amount camera can pitch in either direction
      maxRoll={0.1} // Max amount camera can roll in either direction
      yawFrequency={1.6} // Frequency of the the yaw rotation
      pitchFrequency={1.6} // Frequency of the pitch rotation
      rollFrequency={1.6} // Frequency of the roll rotation
      intensity={0.5} // initial intensity of the shake
      // decay
      // decayRate={0.3} // if decay = true this is the rate at which intensity will reduce at
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
