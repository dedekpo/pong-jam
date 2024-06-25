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
import { TABLE_WIDTH } from "../config";

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
  const { opponentApi, ballApi, racketApi, playerIsHandlingBall } = useRefs();
  const { setTouchedLastBy } = useGameStore((state) => state);
  const setIsConfettiActive = useConfettiStore(
    (state) => state.setIsConfettiActive
  );
  const { setOpponentName } = useNamesStore((state) => state);
  const { setOpponentColor } = usePaddleStore((state) => state);
  const mousePosition = useTouchPosition();
  const addVictory = useGamificationStore((state) => state.addVictory);

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

    room.onMessage(
      "update-positions",
      ({ ball, playerRacket, opponentRacket }) => {
        const playerIsHost = room.sessionId === hostIdRef.current;

        ballApi?.current?.setTranslation(
          {
            x: ball.x,
            y: ball.y,
            z: ball.z * (playerIsHost ? 1 : -1),
          },
          true
        );

        if (playerIsHost) {
          racketApi?.current?.setTranslation(playerRacket, true);
          opponentApi?.current?.setTranslation(opponentRacket, true);
          return;
        }

        racketApi?.current?.setTranslation(
          {
            x: opponentRacket.x,
            y: opponentRacket.y,
            z: 30,
          },
          true
        );

        opponentApi?.current?.setTranslation(
          {
            x: playerRacket.x,
            y: playerRacket.y,
            z: -30,
          },
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

    room.onMessage("winner", (playerId) => {
      setIsGameStarted(false);
      setGameState("END-GAME-ONLINE");
      setPlayerWon(room.sessionId === playerId);
      if (room.sessionId === playerId) {
        addVictory();
        setIsConfettiActive(true);
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
