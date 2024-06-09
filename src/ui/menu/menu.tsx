import { InternetIcon, Rank, RobotIcon } from "../../assets/icons";
import useGameController from "../../hooks/useGameController";
import useOnline from "../../hooks/useOnline";
import { useGameControllerStore } from "../../stores/game-store";
import { useOnlineStore } from "../../stores/online-store";
import EditPaddle from "./edit-paddle";

export default function Menu() {
  const { isGameStarted } = useGameControllerStore();
  const { handleStartGame } = useGameController();
  const { joinRoom } = useOnline();
  const { searchingMatch, setSearchingMatch } = useOnlineStore(
    (state) => state
  );

  async function handlePlayOnline() {
    setSearchingMatch(true);
    await joinRoom();
  }

  return (
    <div className="absolute top-0 left-0 h-screen w-screen">
      {searchingMatch && (
        <div>
          <div className="absolute top-0 right-0 flex items-center justify-center h-screen w-screen">
            <div>Searching for match...</div>
          </div>
        </div>
      )}
      {!isGameStarted && !searchingMatch && (
        <>
          <div className="absolute top-0 bottom-0 my-auto right-[8vw] h-min flex flex-col gap-10">
            <ButtonMenu icon={<InternetIcon />}>Play vs Friend</ButtonMenu>
            <ButtonMenu icon={<Rank />} onClick={handlePlayOnline} translateX>
              Play Online
            </ButtonMenu>
            <ButtonMenu icon={<RobotIcon />} onClick={handleStartGame}>
              Play vs AI
            </ButtonMenu>
          </div>
          <div className="absolute top-10 right-0 left-0 mx-auto w-min flex flex-col items-center">
            <span className="text-gray-100">Player name:</span>
            <input
              type="text"
              className="w-[200px] border-2 p-4 py-1 font-bold rounded-lg shadow-2xl text-gray-600"
              value="Player 1"
            />
          </div>
          <div className="absolute top-10 left-10 w-min flex gap-4 items-center font-bold text-2xl">
            <div className="relative border-2">
              <div className="size-12 bg-red-400 rotate-45 border-2" />
              <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-100">
                10
              </span>
            </div>
            <span className="text-gray-100">Victories</span>
          </div>
          <EditPaddle />
        </>
      )}
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  translateX?: boolean;
  icon?: React.ReactNode;
}

function ButtonMenu({ children, translateX, icon, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`w-[300px] h-[100px] bg-gray-100 border-2 rounded-lg shadow-2xl text-3xl font-bold flex items-center justify-center gap-4
        ${translateX && `-translate-x-[30px]`}
    `}
    >
      <span> {children}</span>
      {icon && <div className="size-14">{icon}</div>}
    </button>
  );
}
