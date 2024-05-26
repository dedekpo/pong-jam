import { RigidBody } from "@react-three/rapier";
import { TABLE_WIDTH } from "../config";
import { useGameStore, useScoreStore } from "../stores/game-store";
import useBall from "../hooks/useBall";

export default function Table() {
  const { touchedLastBy, setTouchedLastTable } = useGameStore((state) => state);
  const { increaseOpponentScore, increasePlayerScore, canScore, setCanScore } =
    useScoreStore((state) => state);
  const { handleResetBall } = useBall();

  function handleTableCollision(player: "player" | "opponent") {
    console.log("table collision", { player, canScore, touchedLastBy });
    switch (player) {
      case "player":
        if (touchedLastBy === "player" && canScore) {
          increaseOpponentScore(1);
          setCanScore(false);
          setTimeout(() => {
            handleResetBall("opponent");
          }, 1000);
        }
        setTouchedLastTable("player");
        break;

      case "opponent":
        if (touchedLastBy === "opponent" && canScore) {
          increasePlayerScore(1);
          setCanScore(false);
          setTimeout(() => {
            handleResetBall("player");
          }, 1000);
        }
        setTouchedLastTable("opponent");
        break;
    }
  }

  return (
    <>
      <RigidBody
        name="player-table"
        type="fixed"
        restitution={0.7}
        friction={0.9}
        onCollisionExit={() => handleTableCollision("player")}
      >
        <mesh position={[0, -2, 15]} receiveShadow castShadow>
          <boxGeometry args={[TABLE_WIDTH, 1, 30]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>
      <RigidBody
        name="opponent-table"
        type="fixed"
        restitution={0.7}
        friction={0.9}
        onCollisionExit={() => handleTableCollision("opponent")}
      >
        <mesh position={[0, -2, -15]} receiveShadow castShadow>
          <boxGeometry args={[TABLE_WIDTH, 1, 30]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>
    </>
  );
}
