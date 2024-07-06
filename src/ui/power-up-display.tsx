import { useEffect, useRef, useState } from "react";
import {
  CameraShakeIcon,
  IncreasePaddleIcon,
  SlowMotionIcon,
  SuperCurveIcon,
  SuperShotIcon,
} from "../assets/power-ups-icons";
import { usePowerUpStore } from "../stores/power-up-store";
import { useGameControllerStore } from "../stores/game-store";

interface PowerUp {
  name: string;
  icon: React.ReactElement;
}

type AvailablePowerUps = {
  [key: string]: PowerUp;
};

const availablePowerUps: AvailablePowerUps = {
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
};

export default function PowerUpDisplay() {
  const { isGameStarted } = useGameControllerStore();

  if (!isGameStarted) return null;

  return (
    <>
      <div className="absolute top-[30px] left-0 right-0 mx-auto w-min z-50 flex gap-16 text-white">
        <PlayerSpinner />
        <OpponentSpinner />
      </div>
    </>
  );
}

function PlayerSpinner() {
  const { p1State, p1PowerUp } = usePowerUpStore();

  const currentPowerUp = p1PowerUp ? availablePowerUps[p1PowerUp] : undefined;

  return (
    <div className="min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px]">
      {p1State === "none" && <EmptySpinner name="Player" />}
      {p1State === "spinning" && <CrazySpinner />}
      {p1State === "showing" && currentPowerUp && (
        <DefinedPowerUp name={currentPowerUp.name} icon={currentPowerUp.icon} />
      )}
    </div>
  );
}

function OpponentSpinner() {
  const { p2State, p2PowerUp } = usePowerUpStore();

  const currentPowerUp = p2PowerUp ? availablePowerUps[p2PowerUp] : undefined;

  return (
    <div className="min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px]">
      {p2State === "none" && <EmptySpinner name="Opponent" />}
      {p2State === "spinning" && <CrazySpinner />}
      {p2State === "showing" && (
        <DefinedPowerUp
          name={currentPowerUp?.name}
          icon={currentPowerUp?.icon}
        />
      )}
    </div>
  );
}

function CrazySpinner() {
  const counter = useRef(0);
  const [currentPowerUp, setCurrentPowerUp] = useState<PowerUp>();

  useEffect(() => {
    const interval = setInterval(() => {
      const randomKey = Object.keys(availablePowerUps)[counter.current];
      counter.current =
        (counter.current + 1) % Object.keys(availablePowerUps).length;
      setCurrentPowerUp(availablePowerUps[randomKey]);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  if (!currentPowerUp) return null;

  return (
    <DefinedPowerUp name={currentPowerUp.name} icon={currentPowerUp.icon} />
  );
}

function EmptySpinner({ name }: { name: string }) {
  return (
    <div className="text-[0.5rem] w-full h-full border-2 rounded-full border-dotted flex items-center justify-center opacity-50">
      {name}
    </div>
  );
}

function DefinedPowerUp({
  name,
  icon,
}: {
  name?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex flex-col items-center gap-2">
      <div className="w-full h-full border-2 rounded-full">{icon}</div>
      <div className="text-[0.5rem] whitespace-nowrap text-center w-min opacity-70">
        {name}
      </div>
    </div>
  );
}
