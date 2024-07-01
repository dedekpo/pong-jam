import { useEffect, useMemo, useRef, useState } from "react";
import {
  CameraShakeIcon,
  IncreasePaddleIcon,
  SlowMotionIcon,
  SuperCurveIcon,
  SuperShotIcon,
} from "../assets/power-ups";
import GameStyle from "./game-style";
import { usePowerUpStore } from "../stores/power-up-store";

export default function PowerUpDisplay() {
  const { isModalOpen } = usePowerUpStore();

  if (!isModalOpen) return null;

  return <PowerUpSpinner />;
}

function PowerUpSpinner() {
  const { selectedPowerUp, setIsModalOpen, setIsActive } = usePowerUpStore();

  const [selectedToDisplay, setSelectedToDisplay] = useState({
    name: "",
    icon: <></>,
  });
  const currentKey = useRef(0);
  const displayedCount = useRef(0);

  const selectedPowerUpRef = useRef(selectedPowerUp);
  useEffect(() => {
    selectedPowerUpRef.current = selectedPowerUp;
  }, [selectedPowerUp]);

  const availablePowerUps = useMemo(
    () => ({
      "super-hit": {
        name: "Super Hit",
        icon: <SuperShotIcon />,
      },
      "super-curve": {
        name: "Super Curve",
        icon: <SuperCurveIcon />,
      },
      "increase-size": {
        name: "Increase Size",
        icon: <IncreasePaddleIcon />,
      },
      "slow-motion": {
        name: "Slow Motion",
        icon: <SlowMotionIcon />,
      },
      "camera-shake": {
        name: "Camera Shake",
        icon: <CameraShakeIcon />,
      },
    }),
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (displayedCount.current >= 20 && selectedPowerUpRef.current) {
        setSelectedToDisplay(availablePowerUps[selectedPowerUpRef.current]);
        setTimeout(() => {
          setIsActive(true);
        }, 1000);
        setTimeout(() => {
          setIsModalOpen(false);
        }, 3000);
        selectedPowerUpRef.current = undefined;
        displayedCount.current = 0;
        return clearInterval(interval);
      }
      const randomKey = Object.keys(availablePowerUps)[currentKey.current];
      currentKey.current =
        (currentKey.current + 1) % Object.keys(availablePowerUps).length;
      // @ts-ignore
      setSelectedToDisplay(availablePowerUps[randomKey]);
      displayedCount.current += 1;
    }, 100);

    return () => {
      displayedCount.current = 0;
      selectedPowerUpRef.current = undefined;
      clearInterval(interval);
    };
  }, []);

  return (
    <GameStyle className="absolute top-[50px] left-0 right-0 mx-auto w-min z-50">
      <div className="bg-white h-full flex items-center justify-center gap-5 p-4">
        <div className="size-[50px]">{selectedToDisplay.icon}</div>
        <span className="text-2xl font-bold w-[165px]">
          {selectedToDisplay.name}
        </span>
      </div>
    </GameStyle>
  );
}
