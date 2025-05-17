import {Entity, Scene} from "phatty";
import {TransformComponent} from "../components/base/TransformComponent.ts";
import {SpriteComponent} from "../components/base/SpriteComponent.ts";
import {ZoomCamera} from "../components/base/camera/ZoomCamera.ts";
import {ImageLoadingKey, MainAssetsFrame} from "../managers/game-object-factory/imageConstants.ts";
import Phaser from "phaser";
import {EventBus} from "../EventBus.ts";
import {ButtonEvent} from "../components/button/constants.ts";
import {CameraEvent} from "../components/base/camera/constants.ts";
import {SpineGameObject} from "@esotericsoftware/spine-phaser-v3";
import {gameObjectFactory} from "../managers/game-object-factory/GameObjectFactory.ts";
import {AnimationLoadingKey} from "../managers/animation-manager/constants.ts";
import {Position} from "../managers/game-object-factory/constants.ts";
import {AnimationPlayingKey} from "../managers/animation-manager/AnimationManager.ts";


export enum GameFieldEvent {
    SHOW_CHARACTER = "GameFieldEvent_SHOW_CHARACTER",
    START_FIREWORKS = "GameFieldEvent_START_FIREWORKS"
}

export const FIRE_WORKS_OFFSETS: Position[] = [
    {
        x: 100, y: 100
    },
    {
        x: -100, y: 100
    },
    {
        x: 100, y: -100
    },
    {
        x: 50, y: 100
    },
    {
        x: -50, y: 100
    },
];

export class GameField extends Phaser.GameObjects.Container {
    public entity: Entity;

    private gameFieldSpriteComponent: SpriteComponent;

    private character: SpineGameObject;

    private fireWorks: Phaser.GameObjects.Sprite[] = [];

    constructor(public scene: Scene, private backgroundComponent: TransformComponent) {
        super(scene, 0, 0);
        this.setupComponents();
        this.setupEventListeners();
        this.handleResize();
        this.setObjectParams();
    }

    private setObjectParams() {
        const backgroundContainer = this.gameFieldSpriteComponent.entity.components.get(TransformComponent).transform;
        backgroundContainer.setAlpha(0);
    }

    private setupComponents() {
        this.entity = this.scene.entities.create();
        this.entity.components.add(TransformComponent, 0, 0);
        this.gameFieldSpriteComponent = this.entity.components.add(SpriteComponent, ImageLoadingKey.MAIN_ASSETS, MainAssetsFrame.GAME_FIELD);
        this.entity.components.add(ZoomCamera);

        this.character = this.scene.add.spine(0, 0, "Character");
        this.character.setVisible(false);


        FIRE_WORKS_OFFSETS.forEach(value => {
            const fireWork = gameObjectFactory.createSprite(this.scene, {
                key: AnimationLoadingKey.FIREWORKS,
                position: {
                    x: 0, y: 0
                }
            });
            this.fireWorks.push(fireWork);
        })
    }

    private setupEventListeners() {
        this.scene.game.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
        EventBus.once(GameFieldEvent.SHOW_CHARACTER, this.showCharacter, this)
        EventBus.on(GameFieldEvent.START_FIREWORKS, this.startFireWorks, this)
    }

    private showCharacter() {
        this.scene.time.delayedCall(555, () => {
            this.character.setVisible(true);
            this.character.once("complete", () => {
                EventBus.emit(ButtonEvent.SHOW);
            })
            this.character.play("cansPlay", true);
        })
    }

    private startFireWorks() {
        let delay = 300;

        FIRE_WORKS_OFFSETS.forEach((_value, index) => {
            this.scene.time.delayedCall(delay, () => {
                this.fireWorks[index].play(AnimationPlayingKey.FIREWORKS_PLAY);
            });
            delay+= 500;
        })
    }

    private handleResize() {
        const containerWithRightPosition = this.backgroundComponent.entity.components.get(TransformComponent).transform;
        const containerToTransform = this.gameFieldSpriteComponent.entity.components.get(TransformComponent).transform;

        if (containerWithRightPosition) {
            containerToTransform.setPosition(containerWithRightPosition.x, containerWithRightPosition.y);
            this.character.setPosition(containerWithRightPosition.x, containerWithRightPosition.y);

            FIRE_WORKS_OFFSETS.forEach((value, index) => {
                this.fireWorks[index].setPosition(containerWithRightPosition.x + value.x, containerWithRightPosition.y + value.y)
            })
        }
    }

    public show() {
        const container = this.gameFieldSpriteComponent.entity.components.get(TransformComponent).transform;
        this.scene.tweens.add({
            targets: container,
            ease: Phaser.Math.Easing.Linear,
            duration: 500,
            alpha: 1,
            onStart: () => {
                EventBus.emit(CameraEvent.ZOOM_IN);
            },
            onComplete: () => {
                EventBus.emit(ButtonEvent.SHOW)
            }
        })
    }

    public hide() {
        const container = this.gameFieldSpriteComponent.entity.components.get(TransformComponent).transform;
        this.scene.tweens.add({
            targets: container,
            ease: Phaser.Math.Easing.Linear,
            duration: 200,
            alpha: 0,
        })
    }
}