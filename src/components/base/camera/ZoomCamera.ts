import {Component} from "phatty";
import Camera = Phaser.Cameras.Scene2D.Camera;
import {TransformComponent} from "../TransformComponent.ts";
import {EventBus} from "../../../EventBus.ts";
import {CameraEvent} from "./constants.ts";

export class ZoomCamera extends Component {
    private zoomLevel: number = 1;
    private minZoom: number = 1;
    private maxZoom: number = 1.7;
    private camera: Camera;

    constructor() {
        super();
    }

    create() {
        const transform = this.entity.components.get(TransformComponent);
        this.camera = transform.scene.cameras.main;
        this.camera.setZoom(this.zoomLevel);
        this.setupEventListeners();
    }

    private setupEventListeners() {
        EventBus.on(CameraEvent.ZOOM_IN, this.zoomIn, this);
        EventBus.on(CameraEvent.ZOOM_OUT, this.zoomOut, this);
    }

    zoomIn() {
        this.camera.zoomTo(this.maxZoom, 700);
    }

    zoomOut() {
        this.camera.zoomTo(this.minZoom, 700);
    }
}