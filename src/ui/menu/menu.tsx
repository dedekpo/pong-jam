import { useState } from "react";
import {
  InternetIcon,
  LoadingSpinnerIcon,
  PlayerIcon,
  Rank,
  RobotIcon,
  XIcon,
} from "../../assets/icons";
import useGameController from "../../hooks/useGameController";
import useOnline from "../../hooks/useOnline";
import {
  useGameControllerStore,
  useGamificationStore,
  useNamesStore,
} from "../../stores/game-store";
import { useOnlineStore } from "../../stores/online-store";
import GameStyle from "../game-style";
import EditPaddle from "./edit-paddle";

export default function Menu() {
  const { isGameStarted } = useGameControllerStore();
  const { handleStartGame } = useGameController();
  const { joinRoom, createRoom, joinByRoomCode, leaveRoom } = useOnline();
  const { searchingMatch, setSearchingMatch } = useOnlineStore(
    (state) => state
  );
  const { setOpponentName } = useNamesStore();

  const [friendlyMenu, setFriendlyMenu] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeInput, setCodeInput] = useState("");

  async function handlePlayOnline() {
    setSearchingMatch(true);
    await joinRoom();
  }

  function handleOpenFriendlyMenu() {
    setSearchingMatch(false);
    setFriendlyMenu(true);
  }

  async function handleCreateRoom() {
    const room = await createRoom();
    setGeneratedCode(room.roomId);
  }

  function handleSearchRoom() {
    joinByRoomCode(codeInput);
  }

  function handleCancelSearch() {
    leaveRoom();
    setSearchingMatch(false);
  }

  function handlePlayVSAI() {
    setOpponentName("");
    handleStartGame();
  }

  return (
    <div className="absolute top-0 left-0 h-screen w-screen overflow-hidden">
      {friendlyMenu && (
        <div className="absolute top-0 right-0 flex items-center justify-center h-screen w-screen">
          <div className="relative">
            <GameStyle className="bg-white w-[50%] h-[90%] lg:w-[450px] lg:h-[350px] rounded-lg">
              <div className="flex flex-col gap-[10%] items-center justify-center h-full">
                <span className="font-bold text-xl uppercase">
                  Challenge a friend
                </span>
                <GameStyle className="h-[40px] w-[200px]">
                  <button
                    className="w-full h-full bg-red-400 font-bold"
                    onClick={handleCreateRoom}
                  >
                    Create room
                  </button>
                </GameStyle>
                {generatedCode ? (
                  <>
                    <span className="border p-2 bg-red-300 rounded-lg">
                      {generatedCode}
                    </span>
                    <span>Share this code with your friend</span>
                  </>
                ) : (
                  <>
                    <span>or</span>
                    <div className="flex gap-2 items-center">
                      <GameStyle className="h-[40px] w-[150px]">
                        <input
                          value={codeInput}
                          onChange={(e) => setCodeInput(e.target.value)}
                          type="text"
                          name="code"
                          id="code"
                          placeholder="Enter room code"
                          className="w-full h-full px-2"
                        />
                      </GameStyle>
                      <GameStyle className="size-10">
                        <button
                          className="w-full h-full bg-red-400 font-bold"
                          onClick={handleSearchRoom}
                        >
                          GO
                        </button>
                      </GameStyle>
                    </div>
                  </>
                )}
              </div>
            </GameStyle>
            <button
              onClick={() => setFriendlyMenu(false)}
              className="absolute -top-4 -right-4 w-12 h-12"
            >
              <GameStyle className="h-full">
                <div className="w-full h-full p-1 bg-red-500">
                  <XIcon />
                </div>
              </GameStyle>
            </button>
          </div>
        </div>
      )}
      {searchingMatch && (
        <div className="absolute top-0 right-0 flex items-center justify-center h-screen w-screen">
          <div className="relative">
            <GameStyle className="bg-white w-[50%] h-[90%] lg:w-[450px] lg:h-[450px] rounded-lg">
              <div className="flex flex-col gap-[10%] items-center justify-center h-full">
                <div className="relative w-[40%] h-[40%] animate-pulse">
                  <PlayerIcon />
                </div>
                <span className="font-bold text-2xl text-center">
                  Searching for worthy opponent
                </span>
                <div className="w-10 h-10 animate-spin">
                  <LoadingSpinnerIcon />
                </div>
              </div>
            </GameStyle>
            <button
              onClick={handleCancelSearch}
              className="absolute -top-4 -right-4 w-12 h-12"
            >
              <GameStyle className="h-full">
                <div className="w-full h-full p-1 bg-red-500">
                  <XIcon />
                </div>
              </GameStyle>
            </button>
          </div>
        </div>
      )}
      {!isGameStarted && !searchingMatch && (
        <>
          <div className="absolute top-0 bottom-0 my-auto right-[5vw] h-min flex flex-col gap-10">
            <ButtonMenu
              icon={<InternetIcon />}
              onClick={handleOpenFriendlyMenu}
            >
              Play vs Friend
            </ButtonMenu>
            <ButtonMenu
              size="big"
              icon={<Rank />}
              onClick={handlePlayOnline}
              translateX
            >
              Play Online
            </ButtonMenu>
            <ButtonMenu icon={<RobotIcon />} onClick={handlePlayVSAI}>
              Play vs AI
            </ButtonMenu>
          </div>
          <NameInput />
          <VictoriesCount />
          <EditPaddle />
        </>
      )}
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  translateX?: boolean;
  icon?: React.ReactNode;
  size?: "small" | "big";
}

function ButtonMenu({
  children,
  translateX,
  icon,
  size = "small",
  ...props
}: ButtonProps) {
  return (
    <div className="relative">
      <GameStyle
        className={`z-10 relative ${translateX && `-translate-x-[30px]`}
        ${size === "big" ? "w-[350px] h-[130px]" : "w-[340px] h-[90px]"}`}
      >
        <button
          {...props}
          className={`w-full h-full bg-gray-100 rounded-lg shadow-2xl text-3xl font-bold flex items-center justify-center gap-4`}
        >
          <span> {children}</span>
          {icon && <div className="size-14">{icon}</div>}
        </button>
      </GameStyle>
      <div className="absolute left-0 top-0 bottom-0 my-auto h-[5px] w-[1000px] bg-gray-300" />
    </div>
  );
}

function NameInput() {
  const { playerName, setPlayerName } = useNamesStore((state) => state);

  return (
    <div className="absolute top-10 right-0 left-0 mx-auto w-min flex flex-col items-center">
      <span className="text-gray-100">Player name:</span>
      <input
        type="text"
        className="w-[200px] border-2 p-4 py-1 font-bold rounded-lg shadow-2xl text-gray-600"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
    </div>
  );
}

/**
 * Renders a component that displays the count of online victories.
 *
 * @return {JSX.Element} The rendered component.
 */
function VictoriesCount() {
  const { victories } = useGamificationStore((state) => state);
  return (
    <div className="absolute top-10 left-10 w-min flex gap-4 items-center font-bold text-2xl">
      <div className="relative border-2">
        <div className="size-12 bg-red-400 rotate-45 border-2" />
        <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-100">
          {victories}
        </span>
      </div>
      <span className="text-gray-100">Online Victories</span>
    </div>
  );
}
