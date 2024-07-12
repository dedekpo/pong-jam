import { Howl } from "howler";

export const pingAudio = new Howl({ src: ["./assets/ping.mp3"] });
export const pongAudio = new Howl({ src: ["./assets/pong.mp3"] });
export const table = new Howl({ src: ["./assets/table.mp3"] });
export const score = new Howl({ src: ["./assets/score.mp3"] });
export const lost = new Howl({ src: ["./assets/lost.mp3"] });
export const selectSound = new Howl({ src: ["./assets/select-sound.mp3"] });
export const victory = new Howl({ src: ["./assets/victory.mp3"] });
export const sunset = new Howl({
  src: ["./assets/sunset.mp3"],
  loop: true,
  volume: 0.5,
});
