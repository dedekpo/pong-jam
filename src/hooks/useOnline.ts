import { Client } from "colyseus.js";
import { useOnlineStore } from "../stores/online-store";
import { useNamesStore, usePaddleStore } from "../stores/game-store";

export default function useOnline() {
  const { room, setClient, setRoom, setSessionId } = useOnlineStore(
    (state) => state
  );
  const { playerName } = useNamesStore((state) => state);
  const { playerColor } = usePaddleStore((state) => state);

  async function joinRoom() {
    // wss://pong-server-production-5438.up.railway.app
    // ws://localhost:2567
    const newClient = new Client("ws://localhost:2567");
    setClient(newClient);

    const room = await newClient.joinOrCreate("pong_room", {
      playerName: playerName,
      playerColor: playerColor,
    });
    setRoom(room);

    setSessionId(room.sessionId);

    return room;
  }

  async function createRoom() {
    const newClient = new Client("ws://localhost:2567");

    setClient(newClient);

    const createdRoom = await newClient.create("pong_room", {
      private: true,
      playerName: playerName,
      playerColor: playerColor,
    });

    setRoom(createdRoom);

    setSessionId(createdRoom.sessionId);

    return createdRoom;
  }

  async function joinByRoomCode(code: string) {
    const newClient = new Client("ws://localhost:2567");
    setClient(newClient);

    const foundRoom = await newClient.joinById(code, {
      playerName: playerName,
      playerColor: playerColor,
    });

    setRoom(foundRoom);

    setSessionId(foundRoom.sessionId);

    return foundRoom;
  }

  function leaveRoom() {
    room?.leave();
    setRoom(undefined);
    setSessionId(undefined);
  }

  return {
    joinRoom,
    createRoom,
    joinByRoomCode,
    leaveRoom,
  };
}
