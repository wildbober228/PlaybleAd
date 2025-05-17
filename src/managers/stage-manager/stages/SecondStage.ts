import {IStage} from "./IStage.ts";
import {StageManager} from "../StageManager.ts";
import {EventBus} from "../../../EventBus.ts";
import {GameEvent} from "./constants.ts";
import {ThirdStage} from "./ThirdStage.ts";

export class SecondStage implements IStage {
    constructor(private stageManager: StageManager) {
    }

    enter(): void {
        this.setupEventListeners();
        this.showPuzzles();
        console.log("enter SecondStage")
    }

    exit(): void {
        this.hidePuzzles();
        console.log("exit SecondStage")
    }

    update(): void {
        console.log("update SecondStage")
    }

    private setupEventListeners() {
        EventBus.once(GameEvent.LOAD_NEXT_STAGE, this.loadNewStage, this);
    }

    private loadNewStage() {
        this.stageManager.stageMachine.changeState(new ThirdStage(this.stageManager))
    }

    private showPuzzles() {
        this.stageManager.gameField.show();
    }

    private hidePuzzles() {
        this.stageManager.gameField.hide();
    }
}