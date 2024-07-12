import { Text } from "@react-three/drei";
import { useNamesStore, useScoreStore } from "../stores/game-store";

export default function Score() {
  const { playerScore, opponentScore } = useScoreStore((state) => state);
  const { opponentName } = useNamesStore();

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
        font="./assets/sans-serif.woff"
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
        font="./assets/sans-serif.woff"
      >
        {opponentScore}
      </Text>
      {opponentName && (
        <Text
          color="white"
          position={[0, 10, -100]}
          rotation={[0, 0, 0]}
          scale={4}
          fontWeight="bold"
          outlineWidth={0.015}
          outlineColor={"black"}
          font="./assets/sans-serif.woff"
        >
          {opponentName}
        </Text>
      )}
    </>
  );
}
