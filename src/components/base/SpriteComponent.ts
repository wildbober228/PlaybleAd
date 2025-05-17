import {Component} from "phatty";
import {TransformComponent} from "./TransformComponent.ts";

export class SpriteComponent extends Component {
    public required = [TransformComponent]
    public sprite: Phaser.GameObjects.Sprite
    private transform!: TransformComponent

    constructor(texture: string, frame?: string) {
        super()
        this.sprite = this.entity.scene.add.sprite(0, 0, texture, frame).setOrigin(0.5, 0.5)
    }

    create() {
        this.transform = this.entity.components.get(TransformComponent)
        this.transform.transform.add(this.sprite)
    }

    destroy() {
        this.sprite.destroy()
    }
}