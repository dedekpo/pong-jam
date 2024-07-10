import { useEffect, useMemo, useRef } from "react";
import { useOnlineStore } from "../../stores/online-store";
import { vec3 } from "@react-three/rapier";
import { getRandomNumberBetween } from "../../utils";
import { useRefs } from "../../contexts/RefsContext";
import { SECONDS_TO_RESPAWN_POWER_UP } from "../../config";
import {
  usePowerUpObjectStore,
  usePowerUpStore,
} from "../../stores/power-up-store";

export default function ObjectSpawner() {
  const { displayPowerUp, setDisplayPowerUp, setPowerUpPosition } =
    usePowerUpObjectStore();
  const { room } = useOnlineStore();
  const { racketMesh } = useRefs();
  const { p1State } = usePowerUpStore();

  const roomRef = useRef(room);
  const displayPowerUpRef = useRef(displayPowerUp);
  const p1StateRef = useRef(p1State);

  const auxVec = useMemo(() => vec3(), []);

  useEffect(() => {
    roomRef.current = room;
    displayPowerUpRef.current = displayPowerUp;
    p1StateRef.current = p1State;
  }, [room, displayPowerUp, p1State]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!displayPowerUpRef.current && p1StateRef.current === "none") {
        let distance = 0;
        let positionToSpawn = vec3({ x: 0, y: 0, z: 0 });

        while (distance < 10) {
          const modifier = Math.random() - 0.5 > 0 ? 1 : -1;
          positionToSpawn = vec3({
            x: 13 * modifier,
            y: getRandomNumberBetween(1, 10),
            z: 30,
          });
          const playerPosition = vec3(
            racketMesh?.current?.getWorldPosition(auxVec)
          );

          distance = positionToSpawn.distanceTo(playerPosition);
        }

        if (roomRef.current) {
          roomRef.current.send("spawn-power-up", positionToSpawn);
        }

        setPowerUpPosition(positionToSpawn);
        setDisplayPowerUp(true);
      }
    }, SECONDS_TO_RESPAWN_POWER_UP * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
