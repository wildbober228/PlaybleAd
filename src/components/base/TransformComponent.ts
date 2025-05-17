import {Component} from "phatty";

export class TransformComponent extends Component {
    public transform: Phaser.GameObjects.Container

    constructor(x: number, y: number) {
        super()
        this.transform = this.entity.scene.add.container(x, y)
    }

    public destroy(): void {
        this.transform.destroy()
    }
}