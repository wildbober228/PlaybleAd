import {Component} from "phatty";
import {TransformComponent} from "../base/TransformComponent.ts";
import Text = Phaser.GameObjects.Text;
import {gameObjectFactory} from "../../managers/game-object-factory/GameObjectFactory.ts";
import {Position} from "../../managers/game-object-factory/constants.ts";

export class TextComponent extends Component {
    public required = [TransformComponent];
    private transformComponent!: TransformComponent;

    private text: Text;

    constructor(private position: Position) {
        super();
    }

    create() {
        this.text = gameObjectFactory.createText(this.entity.scene, {
            fontSize: "100px",
            position: {
                x: this.position.x,
                y: this.position.y
            },
            text: "NEXT STAGE",
            origin: {
                x: 0.5,
                y: 0.5
            }
        })
        this.transformComponent = this.entity.components.get(TransformComponent);
        this.transformComponent.transform.add(this.text);
    }

    destroy() {
        this.text.destroy();
    }
}