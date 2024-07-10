import { useState } from "react";
import {
  InternetIcon,
  LoadingSpinnerIcon,
  PlayerIcon,
  Rank,
  RejectIcon,
  RobotIcon,
  ThumbsUpIcon,
  XIcon,
} from "../../assets/icons";
import useGameController from "../../hooks/useGameController";
import useOnline from "../../hooks/useOnline";
import {
  useGameControllerStore,
  useGamificationStore,
  useNamesStore,
  useScoreStore,
} from "../../stores/game-store";
import { useOnlineStore } from "../../stores/online-store";
import GameStyle from "../game-style";
import EditPaddle from "./edit-paddle";

export default function Menu() {
  const { gameState } = useGameControllerStore();

  return (
    <div className="absolute top-0 left-0 h-screen w-screen overflow-hidden">
      {gameState === "FRIENDLY-MENU" && <FriendlyMatchMenu />}
      {gameState === "SEARCHING-ONLINE" && <SearchingMatchMenu />}
      {gameState === "MENU" && <MainMenu />}
      {gameState === "END-GAME-ONLINE" && <EndOnlineGameMenu />}
      {gameState === "END-GAME-VS-AI" && <EndAiGameMenu />}
    </div>
  );
}

function EndAiGameMenu() {
  const { setGameState } = useGameControllerStore();
  const { handleStartGame } = useGameController();
  const playerWon = useScoreStore((state) => state.playerWon);

  function handleRematch() {
    setGameState("PLAYING-VS-AI");
    handleStartGame();
  }

  function handleGoToMenu() {
    setGameState("MENU");
  }

  return (
    <div className="h-full flex items-center justify-center">
      <GameStyle className="bg-white w-[50%] h-[90%] lg:w-[450px] lg:h-[450px] rounded-lg">
        <div className="flex flex-col items-center justify-center h-full gap-10">
          <span className="font-bold text-2xl">
            {playerWon ? "You win!" : "AI wins!"}
          </span>
          <div className="flex flex-col w-full items-center gap-4">
            <GameStyle className="w-[50%] h-12">
              <button onClick={handleRematch} className="w-full h-full">
                Play Again
              </button>
            </GameStyle>
            <GameStyle className="w-[50%] h-12">
              <button onClick={handleGoToMenu} className="w-full h-full">
                Go to Menu
              </button>
            </GameStyle>
          </div>
        </div>
      </GameStyle>
    </div>
  );
}

function EndOnlineGameMenu() {
  const { setGameState } = useGameControllerStore();
  const playerWon = useScoreStore((state) => state.playerWon);
  const { opponentName } = useNamesStore((state) => state);
  const { room, opponentRematchVote } = useOnlineStore();
  const [votedForRematch, setVotedForRematch] = useState(false);
  const { leaveRoom } = useOnline();

  function handleRematch() {
    room?.send("rematch-vote", { vote: "ACCEPT" });
    setVotedForRematch(true);
  }

  function handlePlayAgain() {
    room?.send("rematch-vote", { vote: "DECLINE" });
    leaveRoom();
  }

  function handleGoToMenu() {
    room?.send("rematch-vote", { vote: "DECLINE" });
    leaveRoom();
    setGameState("MENU");
  }

  return (
    <div className="h-full flex items-center justify-center">
      <GameStyle className="bg-white w-[50%] h-[90%] lg:w-[450px] lg:h-[450px] rounded-lg">
        <div className="flex flex-col items-center justify-center h-full gap-5 lg:gap-10">
          <span className="font-bold text-2xl">
            {playerWon ? "You win!" : `${opponentName} wins!`}
          </span>
          <div className="flex flex-col items-center gap-2 text-black">
            <VictoriesCount />
          </div>
          <div className="flex flex-col w-full items-center gap-3 lg:gap-4">
            <GameStyle className="relative w-[50%] h-10 lg:h-12">
              {votedForRematch && (
                <div className="absolute -left-[22%] top-0 bottom-0">
                  <div className="size-12">
                    <ThumbsUpIcon />
                  </div>
                </div>
              )}
              <button
                disabled={votedForRematch || opponentRematchVote === "DECLINE"}
                onClick={handleRematch}
                className="w-full h-full"
              >
                Rematch
              </button>
              {opponentRematchVote === "ACCEPT" && (
                <div className="absolute -right-[22%] top-0 bottom-0">
                  <div className="size-12">
                    <ThumbsUpIcon />
                  </div>
                </div>
              )}
              {opponentRematchVote === "DECLINE" && (
                <div className="absolute -right-[21%] top-0 bottom-0 flex items-center justify-center">
                  <div className="size-10">
                    <RejectIcon />
                  </div>
                </div>
              )}
            </GameStyle>
            <GameStyle className="w-[50%] h-10 lg:h-12">
              <button onClick={handlePlayAgain} className="w-full h-full">
                New Match
              </button>
            </GameStyle>
            <GameStyle className="w-[50%] h-10 lg:h-12">
              <button onClick={handleGoToMenu} className="w-full h-full">
                Go to Menu
              </button>
            </GameStyle>
          </div>
        </div>
      </GameStyle>
    </div>
  );
}

function MainMenu() {
  const { setOpponentName } = useNamesStore();
  const { setGameState } = useGameControllerStore();
  const { joinRoom } = useOnline();
  const { handleStartGame } = useGameController();

  function handleOpenFriendlyMenu() {
    setGameState("FRIENDLY-MENU");
  }

  async function handlePlayOnline() {
    setGameState("SEARCHING-ONLINE");
    await joinRoom();
  }

  function handlePlayVSAI() {
    setGameState("PLAYING-VS-AI");
    setOpponentName("");
    handleStartGame();
  }

  return (
    <>
      <div className="absolute top-0 bottom-0 my-auto right-5 lg:right-[5vw] h-min flex flex-col gap-5 lg:gap-10">
        <ButtonMenu icon={<InternetIcon />} onClick={handleOpenFriendlyMenu}>
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
      <div className="absolute top-10 left-10 w-min flex gap-4 items-center font-bold text-2xl text-gray-100">
        <VictoriesCount />
      </div>
      <EditPaddle />
    </>
  );
}

function SearchingMatchMenu() {
  const { opponentFound } = useOnlineStore((state) => state);
  const { opponentName } = useNamesStore();
  const { leaveRoom } = useOnline();
  const { setGameState } = useGameControllerStore();

  function handleCancelSearch() {
    leaveRoom();
    setGameState("MENU");
  }

  return (
    <div className="absolute top-0 right-0 flex items-center justify-center h-screen w-screen">
      <div className="relative">
        <GameStyle className="bg-white w-[450px] h-[350px] lg:w-[450px] lg:h-[450px] rounded-lg">
          <div className="flex flex-col gap-[10%] items-center justify-center h-full">
            <div className="relative w-[40%] h-[40%] animate-pulse">
              <PlayerIcon />
            </div>
            <span className="font-bold text-2xl text-center">
              {`${
                opponentFound
                  ? `Opponent found: ${opponentName}`
                  : "Searching for worthy opponent"
              }`}
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
  );
}

function FriendlyMatchMenu() {
  const { createRoom, joinByRoomCode } = useOnline();

  const [generatedCode, setGeneratedCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const { setGameState } = useGameControllerStore();

  async function handleCreateRoom() {
    const room = await createRoom();
    setGeneratedCode(room.roomId);
  }

  function handleSearchRoom() {
    joinByRoomCode(codeInput);
  }

  function handleCloseFriendlyMenu() {
    setGeneratedCode("");
    setCodeInput("");
    setGameState("MENU");
  }

  return (
    <div className="absolute top-0 right-0 flex items-center justify-center h-screen w-screen">
      <div className="relative">
        <GameStyle className="bg-white w-[400px] h-[300px] lg:w-[450px] lg:h-[350px] rounded-lg">
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
          onClick={handleCloseFriendlyMenu}
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
        ${
          size === "big"
            ? "w-[230px] h-[90px] lg:w-[350px] lg:h-[130px]"
            : "w-[210px] h-[70px] lg:w-[340px] lg:h-[90px]"
        }`}
      >
        <button
          {...props}
          className={`w-full h-full bg-gray-100 rounded-lg shadow-2xl text-xl lg:text-3xl font-bold flex items-center justify-center gap-4`}
        >
          <span>{children}</span>
          {icon && <div className="size-10 lg:size-14">{icon}</div>}
        </button>
      </GameStyle>
      <div className="absolute left-0 top-0 bottom-0 my-auto h-[5px] w-[1000px] bg-gray-300" />
    </div>
  );
}

function NameInput() {
  const { playerName, setPlayerName } = useNamesStore((state) => state);

  return (
    <div className="absolute top-3 lg:top-10 right-0 left-0 mx-auto w-min flex flex-col items-center">
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

function VictoriesCount() {
  const { victories } = useGamificationStore((state) => state);
  return (
    <>
      <div className="relative border-2">
        <div className="size-12 bg-red-400 rotate-45 border-2" />
        <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-100">
          {victories}
        </span>
      </div>
      <span>Online Victories</span>
    </>
  );
}
