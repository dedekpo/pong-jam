import "./index.css";
import { RefsProvider } from "./contexts/RefsContext";
import Score from "./ui/Score";
import Scene from "./components/Scene";
export default function App() {
  return (
    <div className="h-screen w-screen">
      <RefsProvider>
        <Scene />
      </RefsProvider>
      <Score />
    </div>
  );
}
