import { create } from "zustand";
import { Client, Room } from "colyseus.js";

export type RematchVoteType = undefined | "ACCEPT" | "DECLINE";

interface OnlineState {
  sessionId?: string;
  setSessionId: (sessionId: string | undefined) => void;
  hostId?: string;
  setHostId: (hostId: string | undefined) => void;
  client?: Client;
  setClient: (client: Client | undefined) => void;
  room?: Room;
  setRoom: (room: Room | undefined) => void;
  opponentFound: boolean;
  setOpponentFound: (found: boolean) => void;
  opponentRematchVote: RematchVoteType;
  setOpponentRematchVote: (vote: RematchVoteType) => void;
}

export const useOnlineStore = create<OnlineState>()((set) => ({
  sessionId: undefined,
  setSessionId: (sessionId) => set({ sessionId }),
  hostId: undefined,
  setHostId: (hostId) => set({ hostId }),
  client: undefined,
  setClient: (client) => set({ client }),
  room: undefined,
  setRoom: (room) => set({ room }),
  opponentFound: false,
  setOpponentFound: (found) => set({ opponentFound: found }),
  opponentRematchVote: undefined,
  setOpponentRematchVote: (vote) => set({ opponentRematchVote: vote }),
}));
