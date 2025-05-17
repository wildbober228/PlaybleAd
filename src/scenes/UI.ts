import {Entity, Scene} from 'phatty'
import {TransformComponent} from "../components/base/TransformComponent.ts";
import {SpriteComponent} from "../components/base/SpriteComponent.ts";
import {SceneType} from "./constants.ts";
import {Button} from "../actors/Button.ts";
import Phaser from "phaser";
import {getCssElementPositionByClassName, translatePositionCssToPhaser} from "../utils.ts";
import {ImageLoadingKey, MainAssetsFrame} from "../managers/game-object-factory/imageConstants.ts";
import {ButtonComponent} from "../components/button/ButtonComponent.ts";
import {GameEvent} from "../managers/stage-manager/stages/constants.ts";
import {TextComponent} from "../components/text/TextComponent.ts";
import {PlayerStuckDetector} from "../managers/PlayerStuckDetector.ts";
import {EventBus} from "../EventBus.ts";
import {gameObjectFactory} from "../managers/game-object-factory/GameObjectFactory.ts";
import {AnimationLoadingKey} from "../managers/animation-manager/constants.ts";
import {AnimationPlayingKey} from "../managers/animation-manager/AnimationManager.ts";
import ANIMATION_COMPLETE_KEY = Phaser.Animations.Events.ANIMATION_COMPLETE_KEY;

const enum Corners {
    BOTTOM_RIGHT = 'BOTTOM_RIGHT',
}

export enum UIEvent {
    SHOW_HAND = "UIEvent_SHOW_HAND"
}

export class UI extends Scene {
    private rightBottomCorner: HTMLDivElement;

    private nextStageButton: Button;
    private goToStoreButton: Button;

    private logoContainer: Phaser.GameObjects.Container;

    private logoEntity: Entity;

    private playerStuckDetector: PlayerStuckDetector;

    private hand: Phaser.GameObjects.Sprite;

    constructor() {
        super(SceneType.UI);
    }

    preload() {
    }

    create() {
        this.createHelpDevElements();
        this.createGameObjects();
        this.setupEventListeners();
        this.playerStuckDetector = new PlayerStuckDetector(this);
        this.handleResize();
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.playerStuckDetector.handlePlayer(time, delta);
    }

    private setupEventListeners() {
        this.scene.scene.game.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
        EventBus.on(UIEvent.SHOW_HAND, this.showHand, this);
        EventBus.on(GameEvent.GO_TO_STORE, () => {
            window.open("https://apps.apple.com/us/app/cradle-of-empires-match-3-game/id738480930", "_blank");
        })
    }

    private showHand() {

        this.scene.scene.tweens.add({
            targets: this.hand,
            duration: 250,
            ease: Phaser.Math.Easing.Linear,
            alpha: 1,
            onComplete: () => {
                this.hand.once(ANIMATION_COMPLETE_KEY + AnimationPlayingKey.HAND_PLAY, () => {
                    this.scene.scene.tweens.add({
                        targets: this.hand,
                        duration: 50,
                        ease: Phaser.Math.Easing.Linear,
                        alpha: 0,
                    })
                })
                this.hand.play(AnimationPlayingKey.HAND_PLAY);
            }
        })
    }

    private createGameObjects() {
        this.nextStageButton = new Button(this, {
                x: 0,
                y: 0
            },
            {
                x: 0.5,
                y: 0.5
            }, MainAssetsFrame.NEXT_STAGE_BUTTON);
        this.nextStageButton.entity.components.add(ButtonComponent, GameEvent.LOAD_NEXT_STAGE);
        this.nextStageButton.entity.components.add(TextComponent, {x: -20, y: 0});

        this.goToStoreButton = new Button(this, {
                x: 0,
                y: 0
            },
            {
                x: 1.4,
                y: 1.4
            }, MainAssetsFrame.PLAY_BUTTON);
        this.goToStoreButton.entity.components.add(ButtonComponent, GameEvent.GO_TO_STORE);

        this.logoEntity = this.entities.create();
        const logoEntityContainer = this.logoEntity.components.add(TransformComponent, 0, 0);
        logoEntityContainer.transform.setScale(0.5, 0.75);
        logoEntityContainer.transform.setPosition(0, -170);
        this.logoEntity.components.add(SpriteComponent, ImageLoadingKey.MAIN_ASSETS, MainAssetsFrame.LOGO);

        this.logoContainer = this.scene.scene.add.container(130, 300);
        this.logoContainer.add(this.goToStoreButton.entity.components.get(TransformComponent).transform);
        this.logoContainer.add(this.logoEntity.components.get(TransformComponent).transform);

        this.hand = gameObjectFactory.createSprite(this.scene.scene, {
            key: AnimationLoadingKey.HAND,
            position: {
                x: 0, y: 0
            }
        });
        this.hand.setAlpha(0);
    }

    private handleResize() {
        const nextStageButtonContainerToResize = this.nextStageButton.entity.components.get(TransformComponent).transform;
        const rightBottomCorner = getCssElementPositionByClassName(Corners.BOTTOM_RIGHT);

        if (rightBottomCorner) {
            const phaserCornerPosition = translatePositionCssToPhaser(rightBottomCorner, nextStageButtonContainerToResize);
            nextStageButtonContainerToResize.setPosition(phaserCornerPosition.x - 220, phaserCornerPosition.y - 100);
            this.hand.setPosition(phaserCornerPosition.x - 200, phaserCornerPosition.y);
        }
    }

    private createHelpDevElements() {
        this.createLeftBottomCorner();
    }

    private createLeftBottomCorner() {
        const divElement = document.createElement('div');
        divElement.style.position = 'absolute';
        divElement.style.right = '0';
        divElement.style.bottom = '0';
        divElement.style.padding = '0';
        divElement.style.zIndex = '100';
        divElement.className = Corners.BOTTOM_RIGHT;

        this.game.canvas.parentNode.appendChild(divElement);
        this.rightBottomCorner = divElement;
    }
}
