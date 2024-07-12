import { Howl } from "howler";

export const pingAudio = new Howl({ src: ["./ping.mp3"] });
export const pongAudio = new Howl({ src: ["./pong.mp3"] });
export const table = new Howl({ src: ["./table.mp3"] });
export const score = new Howl({ src: ["./score.mp3"] });
export const lost = new Howl({ src: ["./lost.mp3"] });
export const selectSound = new Howl({ src: ["./select-sound.mp3"] });
export const victory = new Howl({ src: ["./victory.mp3"] });
export const sunset = new Howl({
  src: ["./sunset.mp3"],
  loop: true,
  volume: 0.5,
});
