import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { SDKFinishLoading } from "../lib/poki-sdk";

export default function LoadingScreen() {
  const { progress } = useProgress();

  const [loaded, setLoaded] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);

  useEffect(() => {
    if (progress === 100 && !loaded && !progressLoaded) {
      setProgressLoaded(true);

      setTimeout(() => {
        SDKFinishLoading();
      }, 500);

      setTimeout(() => {
        setLoaded(true);
      }, 3000);
    }
  }, [progress]);

  if (loaded && progressLoaded) return null;

  return (
    <div
      style={{
        zIndex: 999999,
      }}
      className="absolute flex flex-col items-center justify-center h-screen w-screen bg-black text-white text-center gap-[4%]"
    >
      <span className="font-bold text-2xl lg:text-7xl">Pong Jam</span>
      <div className="font-bold text-2xl lg:text-7xl border-4 border-white py-4 w-[50%]">
        {progress.toFixed(0)}%
      </div>
      <span className="text-gray-500">Made by André Dev</span>
    </div>
  );
}
