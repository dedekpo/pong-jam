import useGameController from "../hooks/useGameController";
import { useGameControllerStore } from "../stores/game-store";

export default function StartGame() {
  const { handleStartGame } = useGameController();
  const { isGameStarted } = useGameControllerStore();

  return (
    <>
      {!isGameStarted && (
        <div className="absolute top-0 right-0 flex flex-col justify-center items-center w-screen h-screen bg-transparent">
          <h1 className="text-[4vh] font-bold">Pong Jam</h1>
          <button
            onClick={handleStartGame}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
          >
            Start Game
          </button>
        </div>
      )}
    </>
  );
}
