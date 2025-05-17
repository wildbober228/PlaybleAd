export interface ApiWrapper {
    playableGoToStore: () => void;
    playableLoaded: () => void;
    playableFinished: () => void;
    playableStarted: () => void;
}