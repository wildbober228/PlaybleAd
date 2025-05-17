import {IStage} from "./IStage.ts";
import {EventBus} from "../../../EventBus.ts";
import {GameEvent} from "./constants.ts";
import {StageManager} from "../StageManager.ts";
import {GameFieldEvent} from "../../../actors/GameField.ts";
import {SoundManager} from "../../sound-manager/SoundManager.ts";
import {SoundLoadingKey} from "../../sound-manager/constants.ts";
import {CameraEvent} from "../../../components/base/camera/constants.ts";
import {ApiWrapper} from "../../../libs/api";
import {ButtonEvent} from "../../../components/button/constants.ts";

export class FourthStage implements IStage {

    private isGameComplete = false;

    constructor(private stageManager: StageManager) {
    }

    enter(): void {
        console.log("enter FourthStage")
        this.setupEventListeners();
        this.showFireWorks();
    }

    exit(): void {
        console.log("exit FourthStage")
    }

    update(): void {
        console.log("update FourthStage")
    }

    private showFireWorks() {
        this.stageManager.scene.time.delayedCall(2000, () => {
            EventBus.emit(ButtonEvent.SHOW);
        });

        EventBus.emit(CameraEvent.ZOOM_OUT);
        SoundManager.getInstance().play(SoundLoadingKey.FIREWORKS);
        EventBus.emit(GameFieldEvent.START_FIREWORKS);

        if (!this.isGameComplete) {
            this.isGameComplete = true;
            (window as ApiWrapper).playableFinished();
        }
    }

    private setupEventListeners() {
        EventBus.on(GameEvent.LOAD_NEXT_STAGE, this.showFireWorks, this);
    }
}