import {Entity, Scene} from "phatty";
import {TransformComponent} from "../components/base/TransformComponent.ts";
import {SpriteComponent} from "../components/base/SpriteComponent.ts";
import {ZoomCamera} from "../components/base/camera/ZoomCamera.ts";
import {ImageLoadingKey, MainAssetsFrame} from "../managers/game-object-factory/imageConstants.ts";
import {getCssElementPositionByClassName, translatePositionCssToPhaser} from "../utils.ts";
import Phaser from "phaser";

const enum Corners {
    CENTER = 'CENTER'
}

export class Background extends Phaser.GameObjects.Container {
    public entity: Entity;

    private centerCorner: HTMLDivElement;

    public backgroundSpriteComponent: SpriteComponent;

    constructor(public scene: Scene) {
        super(scene, 0, 0);
        this.setupComponents();
        this.createHelpDevElements();
        this.setupEventListeners();
        this.handleResize();
        this.setObjectParams();
    }

    private setObjectParams() {
        const backgroundContainer = this.backgroundSpriteComponent.entity.components.get(TransformComponent).transform;
        backgroundContainer.setScale(1.4, 1.35);
    }

    private setupComponents() {
        this.entity = this.scene.entities.create();
        this.entity.components.add(TransformComponent, 0, 0);
        this.backgroundSpriteComponent = this.entity.components.add(SpriteComponent, ImageLoadingKey.MAIN_ASSETS, MainAssetsFrame.BACKGROUND);
        this.entity.components.add(ZoomCamera);
    }

    private setupEventListeners() {
        this.scene.game.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    }

    private handleResize() {
        const containerToResize = this.backgroundSpriteComponent.entity.components.get(TransformComponent).transform;
        const centerCorner = getCssElementPositionByClassName(Corners.CENTER);

        if (centerCorner) {
            const phaserCornerPosition = translatePositionCssToPhaser(centerCorner, containerToResize);
            containerToResize.setPosition(phaserCornerPosition.x, phaserCornerPosition.y);
        }
    }

    private createHelpDevElements() {
        this.createLeftBottomCorner();
    }

    private createLeftBottomCorner() {
        const divElement = document.createElement('div');
        divElement.style.position = 'fixed';
        divElement.style.left = '50%';
        divElement.style.top = '50%';
        divElement.style.transform = 'translate(-50%, -50%)';
        divElement.style.padding = '0';
        divElement.style.zIndex = '100';

        divElement.className = Corners.CENTER;

        this.entity.scene.game.canvas.parentNode.appendChild(divElement);
        this.centerCorner = divElement;
    }
}