export default function Lights() {
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
