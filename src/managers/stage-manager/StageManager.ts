import {StageMachine} from "./stages/StageMachine.ts";
import {FirstStage} from "./stages/FirstStage.ts";
import {GameField} from "../../actors/GameField.ts";

export class StageManager {

    public stageMachine: StageMachine

    private static instance: StageManager | null = null;

    private constructor(public scene: Phaser.Scene, public gameField: GameField) {
        this.initialize();
    }

    public static getInstance(scene: Phaser.Scene, gameField: GameField): StageManager {
        if (StageManager.instance) {
            return StageManager.instance;
        }

        StageManager.instance = new StageManager(scene, gameField);
        return StageManager.instance;
    }

    private initialize() {
        this.stageMachine = new StageMachine(this);
        this.stageMachine.initialize(new FirstStage(this));
    }
}