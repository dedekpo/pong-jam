import useGameController from "../hooks/useGameController";
import { useGameControllerStore } from "../stores/game-store";

export default function StartGame() {
  const { handleStartGame } = useGameController();
  const { isGameStarted } = useGameControllerStore();

  return (
    <>
      {!isGameStarted && (
        <div className="absolute top-0 right-0 flex items-center justify-center h-screen w-screen">
          <button
            onClick={handleStartGame}
            className="mx-auto bg-red-600 w-[20vw] h-[5vw] text-[2vw] rounded-full hover:bg-red-700 active:bg-red-500 shadow-2xl
              border-4 border-black text-white font-bold uppercase
            "
          >
            Start Game
          </button>
        </div>
      )}
    </>
  );
}
