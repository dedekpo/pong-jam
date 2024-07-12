declare namespace PokiSDK {
  function init(): Promise<void>;
  function setDebug(value: boolean): Promise<void>;
  function gameLoadingStart(): Promise<void>;
  function gameLoadingFinished(): Promise<void>;
  function commercialBreak(): Promise<void>;
  function gameplayStart(): Promise<void>;
  function happyTime(n: number): Promise<void>;
  function gameplayStop(): Promise<void>;
  function rewardedBreak(): Promise<any>;
}
