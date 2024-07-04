import { Sparkles } from "@react-three/drei";

export default function OpponentPowerUp({
  powerUpPosition,
}: {
  powerUpPosition: { x: number; y: number; z: number };
}) {
  return (
    <group position={[powerUpPosition.x, powerUpPosition.y, powerUpPosition.z]}>
      <Sparkles scale={1} size={20} color={"yellow"} speed={2} />
      <group>
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
