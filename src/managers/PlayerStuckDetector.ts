import {EventBus} from "../EventBus.ts";
import {UIEvent} from "../scenes/UI.ts";

export class PlayerStuckDetector {

    private idleTimer = 0;
    private isIdle = false;
    private lastMouseX = 0;
    private lastMouseY = 0;

    constructor(private scene: Phaser.Scene) {
        this.setupEventListeners();
    }

    public handlePlayer(time, delta) {
        if (!this.isIdle) {
            this.idleTimer += delta;

            if (this.idleTimer >= 3000) {
                this.isIdle = true;
                EventBus.emit(UIEvent.SHOW_HAND);
                this.scene.time.delayedCall(300, () => {
                    this.resetIdleTimer();
                })
            }
        }
    }

    private setupEventListeners() {
        this.scene.input.on('pointerdown', () => this.resetIdleTimer());

        this.scene.input.on('pointermove', (pointer) => {
            if (pointer.x !== this.lastMouseX || pointer.y !== this.lastMouseY) {
                this.lastMouseX = pointer.x;
                this.lastMouseY = pointer.y;
                this.resetIdleTimer();
            }
        });

        this.resetIdleTimer();
    }

    private resetIdleTimer() {
        this.idleTimer = 0;
        this.isIdle = false;
    }
}