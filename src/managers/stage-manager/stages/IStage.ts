export interface IStage {
    enter: () => void;
    update: () => void;
    exit: () => void;
}