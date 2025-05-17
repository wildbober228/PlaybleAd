import {Component} from "phatty";
import {SpriteComponent} from "../base/SpriteComponent.ts";
import {TransformComponent} from "../base/TransformComponent.ts";
import {EventBus} from "../../EventBus.ts";
import {ButtonEvent} from "./constants.ts";
import {SoundManager} from "../../managers/sound-manager/SoundManager.ts";
import {SoundLoadingKey} from "../../managers/sound-manager/constants.ts";

export class ButtonComponent extends Component {
    public required = [SpriteComponent];
    private spriteComponent!: SpriteComponent;
    private transformComponent!: TransformComponent;

    private isButtonBusy = false;

    constructor(private eventName: string) {
        super();
    }

    private setupEventListeners() {
        const buttonImage = this.spriteComponent.sprite
        buttonImage.setInteractive()

        buttonImage.on('pointerover', () => {
            buttonImage.setTint(0x2980b9);
        });

        buttonImage.on('pointerout', () => {
            buttonImage.clearTint();
        });

        buttonImage.on('pointerdown', () => {
            buttonImage.setTint(0x1f618d);
            this.playOnButtonClickEffect();
        });

        buttonImage.on('pointerup', () => {
            buttonImage.setTint(0x2980b9);
        });

        EventBus.on(ButtonEvent.SHOW, this.showButton, this);
    }

    create() {
        this.spriteComponent = this.entity.components.get(SpriteComponent);
        this.transformComponent = this.entity.components.get(TransformComponent);
        this.setupEventListeners();
    }

    private playOnButtonClickEffect() {
        if (this.isButtonBusy) {
            return;
        }

        this.isButtonBusy = true;
        SoundManager.getInstance().play(SoundLoadingKey.CLICK, false, true);
        const currentScale = this.transformComponent.transform.scale;

        this.scene.tweens.add({
            targets: this.transformComponent.transform,
            ease: Phaser.Math.Easing.Cubic.Out,
            scale: {
                from: currentScale,
                to: currentScale + 0.2
            },
            yoyo: true,
            duration: 50,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.transformComponent.transform,
                    ease: Phaser.Math.Easing.Linear,
                    alpha: 0,
                    duration: 150,
                    onComplete: () => {
                        EventBus.emit(this.eventName);
                        this.isButtonBusy = false;
                    }
                })
            }
        })
    }

    private showButton() {
        this.transformComponent.transform.setAlpha(1);
    }

    destroy() {
    }
}