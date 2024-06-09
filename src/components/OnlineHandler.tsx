import { useEffect } from "react";
import { useOnlineStore } from "../stores/online-store";
import {
  useGameControllerStore,
  useGameStore,
  useScoreStore,
} from "../stores/game-store";
import { useRefs } from "../contexts/RefsContext";

type PlayerType = {
  isHost: boolean;
  isHandlingBall: boolean;
  score: number;
  position: {
    x: number;
    y: number;
  };
};

type BallType = {
  ballTranslation: {
    x: number;
    y: number;
    z: number;
  };
  ballLinvel: {
    x: number;
    y: number;
    z: number;
  };
  ballAngvel: {
    x: number;
    y: number;
    z: number;
  };
};

const UPDATE_INTERVAL = 1000 / 60;

export default function OnlineHandler() {
  const { room, sessionId, setSearchingMatch, setHostId } = useOnlineStore(
    (state) => state
  );
  const { setIsGameStarted } = useGameControllerStore();
  const { resetScores, increaseOpponentScore, increasePlayerScore } =
    useScoreStore();
  const { opponentApi, racketApi, ballApi, playerIsHandlingBall } = useRefs();
  const { setTouchedLastBy } = useGameStore((state) => state);
  // const { handleResetBall } = useBall();

  function handleUpdate() {
    const interval = setInterval(() => {
      const playerPosition = racketApi?.current?.translation();

      room?.send("update", {
        positionX: playerPosition?.x || 0,
        positionY: playerPosition?.y || 0,
      });

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

    room.onMessage("found-match", ({ hostId }) => {
      setHostId(hostId);
      setSearchingMatch(false);
      resetScores();
      setTouchedLastBy(undefined);
    });

    room.onMessage("match-started", () => {
      setSearchingMatch(false);
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

    room.onMessage("serve", ({ ball, playerId }) => {
      const playerScored = room.sessionId === playerId;
      ballApi?.current?.setTranslation(
        {
          x: ball.ballTranslation.x,
          y: ball.ballTranslation.y,
          z: ball.ballTranslation.z * (playerScored ? 1 : -1),
        },
        true
      );
      ballApi?.current?.setLinvel(
        {
          x: ball.ballLinvel.x,
          y: ball.ballLinvel.y,
          z: ball.ballLinvel.z * (playerScored ? 1 : -1),
        },
        true
      );
    });

    room.onMessage(
      "update",
      ({
        players,
        ball,
      }: {
        players: Record<string, PlayerType>;
        ball: BallType;
      }) => {
        for (const [key, value] of Object.entries(players)) {
          if (key === sessionId) {
            playerIsHandlingBall.current = value.isHandlingBall;
            continue;
          }

          // Opponent values
          opponentApi?.current?.setTranslation(
            { x: value.position.x, y: value.position.y, z: -30 },
            true
          );

          playerIsHandlingBall.current = !value.isHandlingBall;
        }

        if (!playerIsHandlingBall.current) {
          const isHost = players[sessionId].isHost;

          ballApi?.current?.setTranslation(
            {
              x: ball.ballTranslation.x,
              y: ball.ballTranslation.y,
              z: ball.ballTranslation.z * (isHost ? 1 : -1),
            },
            true
          );
          ballApi?.current?.setLinvel(
            {
              x: ball.ballLinvel.x,
              y: ball.ballLinvel.y,
              z: ball.ballLinvel.z * (isHost ? 1 : -1),
            },
            true
          );
        }
      }
    );

    return () => {
      room.leave();
      clearInterval(interval);
    };
  }, [room]);

  return <></>;
}
