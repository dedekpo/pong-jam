import { Text } from "@react-three/drei";
import { useScoreStore } from "../stores/game-store";

export default function Score() {
  const { playerScore, opponentScore } = useScoreStore((state) => state);

  return (
    <>
      <Text
        color="white"
        position={[-25, 10, 20]}
        rotation={[0, Math.PI / 2, 0]}
        scale={20}
        fontWeight="bold"
        outlineWidth={0.015}
        outlineColor={"black"}
      >
        {playerScore}
      </Text>
      <Text
        color="white"
        position={[-25, 10, -20]}
        rotation={[0, Math.PI / 2, 0]}
        scale={20}
        fontWeight="bold"
        outlineWidth={0.015}
        outlineColor={"black"}
      >
        {opponentScore}
      </Text>
    </>
  );
}
