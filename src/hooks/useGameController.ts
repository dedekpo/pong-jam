import { score } from "../audios";
import {
  useGameControllerStore,
  useGameStore,
  useScoreStore,
} from "../stores/game-store";
import useBall from "./useBall";

export default function useGameController() {
  const { setIsGameStarted } = useGameControllerStore();
  const { setTouchedLastBy, setTouchedLastTable } = useGameStore();
  const {
    resetScores,
    increaseOpponentScore,
    increasePlayerScore,
    canScore,
    setCanScore,
    playerScore,
    opponentScore,
  } = useScoreStore();
  const { handleResetBall } = useBall();

  function handleStartGame() {
    setIsGameStarted(true);
    setTouchedLastBy(undefined);
    setTouchedLastTable(undefined);
    resetScores();
  }

  function handleEndGame() {
    setIsGameStarted(false);
  }

  function handleScore(player: "player" | "opponent") {
    if (!canScore) return;

    if (player === "player") {
      if (playerScore === 4) {
        handleEndGame();
      }
    }

    if (player === "opponent") {
      if (opponentScore === 4) {
        handleEndGame();
      }
    }

    setCanScore(false);
    setTimeout(() => {
      handleResetBall(player);
    }, 1000);
  }

  function handlePlayerScore() {
    handleScore("player");
    increasePlayerScore(1);
    score.play();
  }

  function handleOpponentScore() {
    handleScore("opponent");
    increaseOpponentScore(1);
    score.play();
  }

  return {
    handleStartGame,
    handleEndGame,
    handlePlayerScore,
    handleOpponentScore,
  };
}
