import {IStage} from "./IStage.ts";
import {EventBus} from "../../../EventBus.ts";
import {GameEvent} from "./constants.ts";
import {StageManager} from "../StageManager.ts";
import {SecondStage} from "./SecondStage.ts";

export class FirstStage implements IStage {

    constructor(private stageManager: StageManager) {}

    enter(): void {
        console.log("enter FirstStage")
        this.setupEventListeners();
    }

    exit(): void {
        console.log("exit FirstStage")
    }

    update(): void {
        console.log("update FirstStage")
    }

    private setupEventListeners() {
        EventBus.once(GameEvent.LOAD_NEXT_STAGE, this.loadNewStage, this);
    }

    private loadNewStage() {
        this.stageManager.stageMachine.changeState(new SecondStage(this.stageManager))
    }
}