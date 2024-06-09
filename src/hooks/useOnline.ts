import { Client } from "colyseus.js";
import { useOnlineStore } from "../stores/online-store";

export default function useOnline() {
  const { setClient, setRoom, setSessionId } = useOnlineStore((state) => state);

  async function joinRoom() {
    const newClient = new Client("ws://localhost:2567");
    setClient(newClient);

    const room = await newClient.joinOrCreate("pong_room");
    setRoom(room);

    setSessionId(room.sessionId);

    return room;
  }

  return {
    joinRoom,
  };
}
