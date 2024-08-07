import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { CameraControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Ball from "../components/Ball";
import Table from "../components/Table";
import Blocker from "../components/Blocker";
import Opponent from "../components/Opponent";
import Player from "../components/Player";
import Lights from "./Lights";
import { BallOutSensor } from "./BallsOutSensor";
import Score from "./Score";
import { useGameControllerStore } from "../stores/game-store";
import Neons from "./Neons";
import { invalidate } from "@react-three/fiber";
import PowerUp from "./power-up/PowerUp";

export default function Scene() {
  const { isGameStarted } = useGameControllerStore();
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  );

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
      invalidate();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Canvas
      frameloop="always"
      shadows
      camera={
        isPortrait
          ? { position: [0, 40, 100], fov: 70 }
          : { position: [0, 20, 55], fov: 50 }
      }
    >
      <color attach="background" args={["#171720"]} />
      <fog attach="fog" args={["#171720", 10, 400]} />
      <Lights />
      <Score />
      <Neons />
      <Suspense>
        <Physics gravity={[0, -40, 0]} paused={!isGameStarted}>
          <Table />
          <Blocker />
          <Player />
          <Opponent />
          <Ball />
          <BallOutSensor />
          <PowerUp />
        </Physics>
      </Suspense>
      <CameraControls />
    </Canvas>
  );
}
