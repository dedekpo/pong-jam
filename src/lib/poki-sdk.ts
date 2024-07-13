import { Howler } from "howler";

export function initSDK() {
  PokiSDK.init()
    .then(startLoading)
    .catch(() => {
      console.log(":( adblock");
    });

  // remove this line in your production build
  PokiSDK.setDebug(true);
}

function startLoading() {
  PokiSDK.gameLoadingStart();
}

export function SDKFinishLoading() {
  PokiSDK.gameLoadingFinished();
}

export function SDKStartGame(callback: () => void) {
  pauseGame();
  PokiSDK.commercialBreak().then(() => {
    unPauseGame();
    PokiSDK.gameplayStart();
    callback();
  });
}

export function SKDStartGameWithoutAd() {
  PokiSDK.gameplayStart();
}

export function SDKStopGame() {
  PokiSDK.gameplayStop();
}

export function SDKRewardedBreak(callback: () => void) {
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
