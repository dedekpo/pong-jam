import { RigidBody } from "@react-three/rapier";
import { TABLE_WIDTH } from "../config";
import { useGameStore } from "../stores/game-store";
import { table } from "../audios";
import useGameController from "../hooks/useGameController";

export default function Table() {
  const { touchedLastBy, touchedLastTable, setTouchedLastTable } = useGameStore(
    (state) => state
  );

  const { handlePlayerScore, handleOpponentScore } = useGameController();

  function handleTableCollision(player: "player" | "opponent") {
    table.play();
    switch (player) {
      case "player":
        if (touchedLastBy === "player" || touchedLastTable === "player") {
          handleOpponentScore();
        }
        setTouchedLastTable("player");
        break;

      case "opponent":
        if (touchedLastBy === "opponent" || touchedLastTable === "opponent") {
          handlePlayerScore();
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
