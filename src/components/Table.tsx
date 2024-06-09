import { RigidBody } from "@react-three/rapier";
import { TABLE_WIDTH } from "../config";
import { useGameStore } from "../stores/game-store";
import { table } from "../audios";
import useGameController from "../hooks/useGameController";
import { useRefs } from "../contexts/RefsContext";
import { useOnlineStore } from "../stores/online-store";

export default function Table() {
  const { touchedLastBy, touchedLastTable, setTouchedLastTable } = useGameStore(
    (state) => state
  );
  const { room } = useOnlineStore((state) => state);

  const { handleScore } = useGameController();
  const { playerIsHandlingBall } = useRefs();

  function handleTableCollision(player: "player" | "opponent") {
    console.log("hit");
    table.play();
    if (player === "player") {
      if (playerIsHandlingBall.current) {
        room?.send("hit-my-table");
      }
      if (touchedLastBy === "player" || touchedLastTable === "player") {
        handleScore("opponent");
      }
      setTouchedLastTable("player");
      return;
    }

    if (player === "opponent") {
      if (playerIsHandlingBall.current) {
        room?.send("hit-opponent-table");
      }
      if (touchedLastBy === "opponent" || touchedLastTable === "opponent") {
        handleScore("player");
      }
      setTouchedLastTable("opponent");
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
        <mesh position={[0, -2, 15]} receiveShadow>
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
        <mesh position={[0, -2, -15]} receiveShadow>
          <boxGeometry args={[TABLE_WIDTH, 1, 30]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>
    </>
  );
}
