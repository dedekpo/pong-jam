import "./index.css";
import { RefsProvider } from "./contexts/RefsContext";
import Scene from "./components/Scene";
import { useEffect } from "react";
import { sunset } from "./audios";
import FullScreen from "./ui/full-screen";
import OnlineHandler from "./components/OnlineHandler";
import Confetti from "./ui/confetti";
import Menu from "./ui/menu/menu";
import PowerUpDisplay from "./ui/power-up-display";
import { initSDK, muteAudio, unMuteAudio } from "./lib/poki-sdk";
import LoadingScreen from "./ui/loading-screen";
export default function App() {
  useEffect(() => {
    sunset.play();

    initSDK();

    function disableArrowNavigation(event: KeyboardEvent) {
      const arrowKeys = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Space",
        "Escape",
      ];

      if (arrowKeys.includes(event.key)) {
        event.preventDefault();
      }
    }

    document.addEventListener("keydown", disableArrowNavigation);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        muteAudio();
      } else {
        unMuteAudio();
      }
    });
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <LoadingScreen />
      <RefsProvider>
        <Scene />
        <Menu />
        <FullScreen />
        <OnlineHandler />
        <Confetti />
        <PowerUpDisplay />
      </RefsProvider>
    </div>
  );
}
