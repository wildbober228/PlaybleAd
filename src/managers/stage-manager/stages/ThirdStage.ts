import {IStage} from "./IStage.ts";
import {EventBus} from "../../../EventBus.ts";
import {GameEvent} from "./constants.ts";
import {StageManager} from "../StageManager.ts";
import {FirstStage} from "./FirstStage.ts";
import {GameFieldEvent} from "../../../actors/GameField.ts";
import {SoundManager} from "../../sound-manager/SoundManager.ts";
import {SoundLoadingKey} from "../../sound-manager/constants.ts";
import {FourthStage} from "./FourthStage.ts";

export class ThirdStage implements IStage {

    constructor(private stageManager: StageManager) {}

    enter(): void {
        console.log("enter ThirdStage")
        this.setupEventListeners();
        this.showCharacter();
    }

    exit(): void {
        console.log("exit ThirdStage")
    }

    update(): void {
        console.log("update ThirdStage")
    }

    private showCharacter() {
        EventBus.emit(GameFieldEvent.SHOW_CHARACTER);
        SoundManager.getInstance().play(SoundLoadingKey.FINE);
    }

    private setupEventListeners() {
        EventBus.once(GameEvent.LOAD_NEXT_STAGE, this.loadNewStage, this);
    }

    private loadNewStage() {
        this.stageManager.stageMachine.changeState(new FourthStage(this.stageManager))
    }
}