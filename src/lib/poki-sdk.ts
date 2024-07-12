import { Howler } from "howler";

export function initSDK() {
  console.log("init sdk");
  PokiSDK.init()
    .then(startLoading)
    .catch(() => {
      console.log(":( adblock");
    });

  // remove this line in your production build
  PokiSDK.setDebug(true);
}

function startLoading() {
  console.log("start loading sdk");
  PokiSDK.gameLoadingStart();
}

export function SDKFinishLoading() {
  console.log("finished loading sdk");
  PokiSDK.gameLoadingFinished();
}

export function SDKStartGame(callback: () => void) {
  console.log("start game sdk");
  pauseGame();
  PokiSDK.commercialBreak().then(() => {
    unPauseGame();
    PokiSDK.gameplayStart();
    callback();
  });
}

export function SKDStartGameWithoutAd() {
  console.log("start game without ad sdk");
  PokiSDK.gameplayStart();
}

export function SDKStopGame() {
  console.log("stop game sdk");
  PokiSDK.gameplayStop();
}

export function SDKRewardedBreak(callback: () => void) {
  console.log("rewarded break sdk");
  pauseGame();
  PokiSDK.rewardedBreak().then((success) => {
    unPauseGame();
    if (success) {
      callback();
    }
  });
}

var pauseGame = function () {
  muteAudio();
  disableKeyboardInput();
};

var unPauseGame = function () {
  unMuteAudio();
  enableKeyboardInput();
};

function disableEvent(event: any) {
  event.preventDefault();
}

function disableKeyboardInput() {
  document.addEventListener("keydown", disableEvent);
}

function enableKeyboardInput() {
  document.removeEventListener("keydown", disableEvent);
}

export function muteAudio() {
  Howler.mute(true);
}

export function unMuteAudio() {
  Howler.mute(false);
}
