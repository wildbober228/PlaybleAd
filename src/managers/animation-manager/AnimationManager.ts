import { AnimationLoadingKey } from './constants.ts';

export const enum AnimationPlayingKey {
  FIREWORKS_PLAY = 'FIREWORKS_PLAY',
  HAND_PLAY = 'HAND_PLAY',
}

type AnimationRegistrationLayout = {
  key: AnimationPlayingKey;
  frames: AnimationLoadingKey;
  frameRate: 32 | 16;
  repeat: number;
};

export const ANIMATIONS_TO_CREATE: AnimationRegistrationLayout[] = [
  {
    key: AnimationPlayingKey.FIREWORKS_PLAY,
    frames: AnimationLoadingKey.FIREWORKS,
    frameRate: 32,
    repeat: 0,
  },
  {
    key: AnimationPlayingKey.HAND_PLAY,
    frames: AnimationLoadingKey.HAND,
    frameRate: 32,
    repeat: 0,
  },
];

export class AnimationManager {
  private animationManager: Phaser.Animations.AnimationManager;

  private static instance: AnimationManager | null = null;

  private constructor(scene: Phaser.Scene) {
    this.animationManager = scene.anims;
  }

  public static getInstance(scene: Phaser.Scene): AnimationManager {
    if (AnimationManager.instance) {
      return AnimationManager.instance;
    }

    AnimationManager.instance = new AnimationManager(scene);
    return AnimationManager.instance;
  }

  public registrationAnimation() {
    ANIMATIONS_TO_CREATE.forEach((animationToRegister) => {
      this.animationManager.create({
        key: animationToRegister.key,
        frames: animationToRegister.frames,
        frameRate: animationToRegister.frameRate,
        repeat: animationToRegister.repeat,
      });
    });
  }
}
