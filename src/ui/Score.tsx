import { useScoreStore } from "../stores/game-store";

export default function Score() {
  const { playerScore, opponentScore } = useScoreStore((state) => state);

  return (
    <div className="absolute top-4 right-0 left-0 mx-auto w-min bg-white flex gap-3 text-xl font-bold whitespace-nowrap p-4 rounded-lg border-4 border-black">
      <span>Player: {playerScore}</span>
      <span>-</span>
      <span>Oponnent: {opponentScore}</span>
    </div>
  );
}
