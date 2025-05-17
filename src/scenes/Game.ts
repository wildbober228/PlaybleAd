import { Scene } from 'phatty'
import {TransformComponent} from "../components/base/TransformComponent.ts";

import {Background} from "../actors/Background.ts";
import {StageManager} from "../managers/stage-manager/StageManager.ts";
import {SceneType} from "./constants.ts";
import {GameField} from "../actors/GameField.ts";
import {ApiWrapper} from "../libs/api";
import {EventBus} from "../EventBus.ts";
import {GameEvent} from "../managers/stage-manager/stages/constants.ts";
import {SoundManager} from "../managers/sound-manager/SoundManager.ts";
import {SoundLoadingKey} from "../managers/sound-manager/constants.ts";

export class Game extends Scene
{

    private stageManager:StageManager;

    constructor ()
    {
        super(SceneType.GAME);
    }

    preload ()
    {
        this.scene.launch(SceneType.UI);
    }

    create ()
    {
        const background =  new Background(this);

        const backgroundContainer = background.backgroundSpriteComponent.entity.components.get(TransformComponent);
        const gameField =  new GameField(this, backgroundContainer);

        this.stageManager = StageManager.getInstance(this, gameField);

        this.setupEventListeners();

        SoundManager.getInstance().play(SoundLoadingKey.LOOP, true);

        (window as ApiWrapper).playableStarted();
    }

    private setupEventListeners() {
        EventBus.once(GameEvent.GO_TO_STORE, this.handleStoreButton, this)
    }

    private handleStoreButton() {
        (window as ApiWrapper).playableGoToStore();
    }
}
