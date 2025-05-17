import {IStage} from "./IStage.ts";
import {StageManager} from "../StageManager.ts";

export class StageMachine {
    public currentState: IStage;

    constructor(public stageManager: StageManager) {
    }

    public initialize(newStage: IStage) {
        this.currentState = newStage;
        this.currentState.enter();
    }

    public changeState(newStage: IStage) {
        this.currentState?.exit();
        this.currentState = newStage;
        this.currentState.enter();
    }

    public updateStage() {
        this.currentState?.update();
    }
}