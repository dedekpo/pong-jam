import { Canvas } from "@react-three/fiber";
import "./index.css";
import { Suspense } from "react";
import { CameraControls } from "@react-three/drei";
import { CuboidCollider, Physics } from "@react-three/rapier";
import Ball from "./components/Ball";
import Table from "./components/Table";
import Blocker from "./components/Blocker";
import { RefsProvider } from "./contexts/RefsContext";
import Opponent from "./components/Opponent";
import Player from "./components/Player";
// import { precisionPositions } from "./config";
import Score from "./ui/Score";
import useBall from "./hooks/useBall";
export default function App() {
  return (
    <div className="h-screen w-screen">
      <RefsProvider>
        <Canvas
          frameloop="always"
          shadows
          camera={{ position: [0, 20, 55], fov: 50 }}
        >
          {/* <TempAuxPrecisionBoxes /> */}
          <color attach="background" args={["#171720"]} />
          <fog attach="fog" args={["#171720", 55, 240]} />
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
          <CameraControls />
        </Canvas>
      </RefsProvider>
      <Score />
    </div>
  );
}

// function TempAuxPrecisionBoxes() {
//   return (
//     <>
//       {Object.entries(precisionPositions).map(([key, value]) => (
//         <mesh key={key} position={value}>
//           <boxGeometry args={[1, 1, 1]} />
//           <meshBasicMaterial color="red" />
//         </mesh>
//       ))}
//     </>
//   );
// }

function BallOutSensor() {
  const { handleResetBall } = useBall();

  return (
    <CuboidCollider
      onIntersectionEnter={() => handleResetBall()}
      sensor
      args={[200, 3, 200]}
      position={[0, -15, 0]}
    />
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 20, -50]} intensity={3} />
      <directionalLight position={[0, 20, 50]} intensity={3} />
      <spotLight
        position={[0, 50, 0]}
        angle={0.8}
        penumbra={1}
        intensity={10000 * 10}
        castShadow
        shadow-mapSize={1024}
        distance={60}
      />
    </>
  );
}
