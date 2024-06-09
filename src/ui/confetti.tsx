import ConfettiExplosion from "react-confetti-explosion";
import { useConfettiStore } from "../stores/game-store";

export default function Confetti() {
  const { isConfettiActive, setIsConfettiActive } = useConfettiStore(
    (state) => state
  );

  return (
    <div className="absolute top-0 left-0 right-0 mx-auto w-10">
      {isConfettiActive && (
        <ConfettiExplosion
          duration={3000}
          onComplete={() => setIsConfettiActive(false)}
        />
      )}
    </div>
  );
}
