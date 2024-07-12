import { useEffect, useRef } from "react";
import { useOnlineStore } from "../stores/online-store";
import {
  useConfettiStore,
  useGameControllerStore,
  useGameStore,
  useGamificationStore,
  useNamesStore,
  usePaddleStore,
  useScoreStore,
} from "../stores/game-store";
import { useRefs } from "../contexts/RefsContext";
import useTouchPosition from "../hooks/useTouchPosition";
import { lerp } from "three/src/math/MathUtils.js";
import { vec3 } from "@react-three/rapier";
import { lost, selectSound, victory } from "../audios";
import { useOpponentStore, usePowerUpStore } from "../stores/power-up-store";
import { TABLE_WIDTH } from "../config";
import { useBallStore } from "../stores/ball-store";
import { SDKStopGame, SKDStartGameWithoutAd } from "../lib/poki-sdk";

const UPDATE_INTERVAL = 1000 / 30;

export default function OnlineHandler() {
  const {
    room,
    sessionId,
    setHostId,
    hostId,
    setOpponentFound,
    setOpponentRematchVote,
  } = useOnlineStore((state) => state);
  const { setIsGameStarted, setGameState } = useGameControllerStore();
  const {
    resetScores,
    increaseOpponentScore,
    increasePlayerScore,
    setPlayerWon,
  } = useScoreStore();
  const {
    racketApi,
    opponentApi,
    ballApi,
    playerIsHandlingBall,
    opponentMesh,
  } = useRefs();
  const { setTouchedLastBy } = useGameStore((state) => state);
  const setIsConfettiActive = useConfettiStore(
    (state) => state.setIsConfettiActive
  );
  const { setOpponentName } = useNamesStore((state) => state);
  const { setOpponentColor } = usePaddleStore((state) => state);
  const mousePosition = useTouchPosition();
  const addVictory = useGamificationStore((state) => state.addVictory);
  const { setPowerUpPosition } = useOpponentStore();
  const { setP2State, setP2PowerUp } = usePowerUpStore();
  const { setPowerUp, setShowTrail } = useBallStore();

  const mousePositionRef = useRef(mousePosition);
  const hostIdRef = useRef(hostId);

  // Update the ref whenever mousePosition changes
  useEffect(() => {
    mousePositionRef.current = mousePosition;
    hostIdRef.current = hostId;
  }, [mousePosition, hostId]);

  function handleUpdate() {
    const interval = setInterval(() => {
      const targetPosition = {
        x: mousePositionRef.current.xPercent * 0.5 - TABLE_WIDTH / 2 - 5,
        y: mousePositionRef.current.yPercent * -0.1 + 10,
      };

      room?.send("update", targetPosition);

      if (playerIsHandlingBall.current) {
        const ballTranslation = ballApi?.current?.translation();
        const ballLinvel = ballApi?.current?.linvel();

        room?.send("update-ball", {
          ballTranslation,
          ballLinvel,
        });
      }
    }, UPDATE_INTERVAL);

    return interval;
  }

  useEffect(() => {
    if (!room || !sessionId) return;

    const interval = handleUpdate();

    room.onMessage("set-show-trail", (show) => {
      setShowTrail(show);
    });

    room.onMessage("ball-changed-trail", (powerUp) => {
      if (powerUp === "none") {
        setPowerUp(undefined);
      }
      if (powerUp === "super-hit") {
        setPowerUp("super-hit");
      }
      if (powerUp === "super-curve") {
        setPowerUp("super-curve");
      }
    });

    room.onMessage("grabbed-power-up", ({ player, powerUp }) => {
      if (player !== room.sessionId) {
        setP2State("spinning");
        setTimeout(() => {
          setP2State("showing");
          setP2PowerUp(powerUp);
        }, 2 * 1000);
        setTimeout(() => {
          setP2State("none");
          setP2PowerUp(undefined);
        }, 6 * 1000);
      }
    });

    room.onMessage("increase-size", ({ player }) => {
      if (player !== room.sessionId) {
        opponentMesh?.current?.scale.set(0.4, 0.4, 0.4);
        setTimeout(() => {
          opponentMesh?.current?.scale.set(0.2, 0.2, 0.2);
        }, 8 * 1000);
      }
    });

    room.onMessage("spawn-power-up", ({ player, position }) => {
      if (player !== room.sessionId) {
        setPowerUpPosition({
          x: position.x,
          y: position.y,
          z: position.z * -1,
        });
      }
    });

    room.onMessage("remove-power-up", ({ player }) => {
      if (player !== room.sessionId) {
        setPowerUpPosition(undefined);
        selectSound.play();
      }
    });

    room.onMessage(
      "update-positions",
      ({ ball, playerRacket, opponentRacket }) => {
        const playerIsHost = room.sessionId === hostIdRef.current;

        const currentBallPosition = vec3(ballApi?.current?.translation());
        const targetBallPosition = {
          x: ball.x,
          y: ball.y,
          z: ball.z * (playerIsHost ? 1 : -1),
        };

        // Define the interpolation factor t (0 to 1)
        const ballT = 0.95; // Adjust t as needed for desired interpolation speed

        const lerpedPosition = {
          x: lerp(currentBallPosition.x, targetBallPosition.x, ballT),
          y: lerp(currentBallPosition.y, targetBallPosition.y, ballT),
          z: lerp(currentBallPosition.z, targetBallPosition.z, ballT),
        };

        ballApi?.current?.setTranslation(lerpedPosition, true);

        const racketT = 0.5;

        const currentPlayerPosition = vec3(racketApi?.current?.translation());
        const playerPositionServer = playerIsHost
          ? playerRacket
          : opponentRacket;
        const targetPlayerPosition = {
          x: playerPositionServer.x,
          y: playerPositionServer.y,
          z: 30,
        };
        const playerLerpedPosition = {
          x: lerp(currentPlayerPosition.x, targetPlayerPosition.x, racketT),
          y: lerp(currentPlayerPosition.y, targetPlayerPosition.y, racketT),
          z: lerp(currentPlayerPosition.z, targetPlayerPosition.z, racketT),
        };

        racketApi?.current?.setTranslation(playerLerpedPosition, true);

        const currentOpponentPosition = vec3(
          opponentApi?.current?.translation()
        );
        const opponentPositionServer = playerIsHost
          ? opponentRacket
          : playerRacket;
        const targetOpponentPosition = {
          x: opponentPositionServer.x,
          y: opponentPositionServer.y,
          z: -30,
        };
        const opponentRacketLerpedPosition = {
          x: lerp(currentOpponentPosition.x, targetOpponentPosition.x, racketT),
          y: lerp(currentOpponentPosition.y, targetOpponentPosition.y, racketT),
          z: lerp(currentOpponentPosition.z, targetOpponentPosition.z, racketT),
        };

        opponentApi?.current?.setTranslation(
          opponentRacketLerpedPosition,
          true
        );
      }
    );

    room.onMessage("found-match", ({ hostId, players }) => {
      setHostId(hostId);
      resetScores();
      setTouchedLastBy(undefined);
      setOpponentFound(true);
      for (const player of players) {
        if (player.id !== sessionId) {
          setOpponentName(player.playerName);
          setOpponentColor(player.playerColor);
        }
      }
    });

    room.onMessage("match-started", () => {
      SKDStartGameWithoutAd();
      setGameState("PLAYING-ONLINE");
      setIsGameStarted(true);
    });

    room.onMessage("scored", (playerId) => {
      const player = playerId === sessionId ? "player" : "opponent";

      if (player === "player") {
        increasePlayerScore(1);
      } else {
        increaseOpponentScore(1);
      }

      setTouchedLastBy(undefined);
    });

    room.onMessage("player-left", (playerId) => {
      if (playerId === sessionId) return;
      setIsGameStarted(false);
      setGameState("END-GAME-ONLINE");
      setPlayerWon(true);
      SDKStopGame();
      addVictory();
      setIsConfettiActive(true);
      victory.play();
    });

    room.onMessage("winner", (playerId) => {
      setIsGameStarted(false);
      setGameState("END-GAME-ONLINE");
      setPlayerWon(room.sessionId === playerId);
      SDKStopGame();
      if (room.sessionId === playerId) {
        addVictory();
        setIsConfettiActive(true);
        victory.play();
      } else {
        lost.play();
      }
    });

    room.onMessage("voted-rematch", (playerId) => {
      if (playerId !== sessionId) {
        setOpponentRematchVote("ACCEPT");
      }
    });

    room.onMessage("declined-rematch", (playerId) => {
      if (playerId !== sessionId) {
        setOpponentRematchVote("DECLINE");
      }
    });

    room.onMessage("rematch", () => {
      setGameState("PLAYING-ONLINE");
      setIsGameStarted(true);
      resetScores();
    });

    return () => {
      room.leave();
      clearInterval(interval);
    };
  }, [room]);

  return <></>;
}
