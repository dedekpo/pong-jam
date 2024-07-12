import { lost, score, victory } from "../audios";
import { SDKStopGame } from "../lib/poki-sdk";
import {
  useConfettiStore,
  useGameControllerStore,
  useGameStore,
  useScoreStore,
} from "../stores/game-store";
import { useOnlineStore } from "../stores/online-store";
import useBall from "./useBall";

export default function useGameController() {
  const { setIsGameStarted, setGameState } = useGameControllerStore();
  const { setTouchedLastBy, setTouchedLastTable } = useGameStore();
  const {
    resetScores,
    increaseOpponentScore,
    increasePlayerScore,
    canScore,
    setCanScore,
    playerScore,
    opponentScore,
    setPlayerWon,
  } = useScoreStore();
  const { handleResetBall } = useBall();
  const { room } = useOnlineStore((state) => state);
  const setIsConfettiActive = useConfettiStore(
    (state) => state.setIsConfettiActive
  );

  function handleStartGame() {
    if (room) return;
    setIsGameStarted(true);
    setTouchedLastBy(undefined);
    setTouchedLastTable(undefined);
    resetScores();
  }

  function handleEndGame() {
    setIsGameStarted(false);
    setGameState("END-GAME-VS-AI");
    setPlayerWon(playerScore > opponentScore);
    SDKStopGame();
    if (playerScore > opponentScore) {
      setIsConfettiActive(true);
      victory.play();
    } else {
      lost.play();
    }
  }

  function handleScore(player: "player" | "opponent") {
    if (!canScore || room?.roomId) return;
    if (player === "player") {
      increasePlayerScore(1);
      if (playerScore >= 6) {
        handleEndGame();
      }
    }

    if (player === "opponent") {
      increaseOpponentScore(1);
      if (opponentScore >= 6) {
        handleEndGame();
      }
    }

    score.play();
    setCanScore(false);

    setTimeout(() => {
      handleResetBall(player);
    }, 1000);
  }

  return {
    handleStartGame,
    handleEndGame,
    handleScore,
  };
}
