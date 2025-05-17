import {Entity, Scene} from "phatty";
import {TransformComponent} from "../components/base/TransformComponent.ts";
import {SpriteComponent} from "../components/base/SpriteComponent.ts";
import {ImageLoadingKey} from "../managers/game-object-factory/imageConstants.ts";
import {Position, Scale} from "../managers/game-object-factory/constants.ts";

export class Button {
    public entity: Entity

    constructor(public scene: Scene, private position: Position, private scale: Scale, private frame: string) {
        this.setupComponents();
        this.setupEventListeners();
    }

    private setupComponents() {
        this.entity = this.scene.entities.create();
        this.entity.components.add(TransformComponent, this.position.x, this.position.y);
        this.entity.components.add(SpriteComponent, ImageLoadingKey.MAIN_ASSETS, this.frame);

        this.entity.components.get(TransformComponent).transform.setScale(this.scale.x, this.scale.y);
        this.entity.components.get(TransformComponent).transform.setScrollFactor(0);
    }

    private setupEventListeners() {
        this.scene.scale.on('resize', this.handleResize, this);
    }

    handleResize(gameSize: Phaser.Structs.Size) {
        this.scene.cameras.main.setSize(gameSize.width, gameSize.height);
        this.entity.components.get(TransformComponent).transform.setPosition(
            this.position.x,
            this.position.y
        );
    }
}