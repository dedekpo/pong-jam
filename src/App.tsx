import "./index.css";
import { RefsProvider } from "./contexts/RefsContext";
import Scene from "./components/Scene";
import { useEffect } from "react";
import { sunset } from "./audios";
import FullScreen from "./ui/full-screen";
import OnlineHandler from "./components/OnlineHandler";
import Confetti from "./ui/confetti";
import Menu from "./ui/menu/menu";
export default function App() {
  useEffect(() => {
    // check if user interacted with the page
    function handleAudio() {
      if (document.visibilityState === "hidden") {
        sunset.pause();
      } else {
        sunset.play();
      }
    }
    document.addEventListener("click", handleAudio);
    document.addEventListener("visibilitychange", handleAudio);
    return () => {
      sunset.pause();
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <RefsProvider>
        <Scene />
        <Menu />
        <FullScreen />
        <OnlineHandler />
        <Confetti />
      </RefsProvider>
    </div>
  );
}
