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
            className="mx-auto bg-red-600 w-[200px] h-[50px] text-[2xl] lg:w-[20vw] lg:h-[5vw] lg:text-[2vw] rounded-full hover:bg-red-700 shadow-2xl
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
