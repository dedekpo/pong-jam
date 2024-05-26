import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
// import { CameraControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Ball from "../components/Ball";
import Table from "../components/Table";
import Blocker from "../components/Blocker";
import Opponent from "../components/Opponent";
import Player from "../components/Player";
import Lights from "./Lights";
import { BallOutSensor } from "./BallsOutSensor";

export default function Scene() {
  return (
    <Canvas
      frameloop="always"
      shadows
      camera={{ position: [0, 20, 55], fov: 50 }}
    >
      <color attach="background" args={["#171720"]} />
      <fog attach="fog" args={["#171720", 100, 200]} />
      <Lights />
      <Suspense>
        <Physics gravity={[0, -40, 0]}>
          <Table />
          <Blocker />
          <Player />
          <Opponent />
          <Ball />
          <BallOutSensor />
        </Physics>
      </Suspense>
      {/* <CameraControls /> */}
    </Canvas>
  );
}