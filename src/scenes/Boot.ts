import { Scene } from 'phaser';
import { AnimationManager } from '../managers/animation-manager/AnimationManager.ts';
import { AssetLoaderManager } from '../managers/AssetLoaderManager.ts';
import { gameObjectFactory } from '../managers/game-object-factory/GameObjectFactory.ts';
import {
  SpineFileConfig,
  SPRITE_SHEET_LAYOUTS,
} from '../managers/game-object-factory/imageConstants.ts';
import { SceneManager } from '../managers/SceneManager.ts';
import { HowlerLoader } from '../managers/sound-manager/HowlerLoader.ts';
import { SCREEN_HALF_H, SCREEN_HALF_W } from '../actors/constants.ts';
import { SceneType } from './constants.ts';

import TESTapi from '../libs/test.js';
import {ApiWrapper} from "../libs/api";
import {SoundLoadingKey} from "../managers/sound-manager/constants.ts";
import {ANIMATION_LOADING_LAYOUTS} from "../managers/animation-manager/constants.ts";

const spineConfig: SpineFileConfig = {
  key: "Character",
  atlasUrl: "spine/symbolCans/symbol_cans.atlas",
  jsonUrl: "spine/symbolCans/symbol_cans.json"
}

export class Boot extends Scene {
  private assetLoaderManager: AssetLoaderManager;

  private animationManager: AnimationManager;

  private sceneManager: SceneManager;

  private howlerLoader: HowlerLoader;

  private isPhaserCompleteLoading = false;

  private isHowlerCompleteLoading = false;

  private loadingText: Phaser.GameObjects.Text;

  private progressBarText: Phaser.GameObjects.Text;

  private loadingContainer: Phaser.GameObjects.Container;

  constructor() {
    super(SceneType.BOOT);
  }

  public preload() {

    const playableApi = new TESTapi();
    playableApi.globalInit();

    this.loadingContainer = this.add.container(0, 0);

    this.loadingText = gameObjectFactory.createText(this, {
      fontSize: 100,
      color: 'white',
      position: {
        x: SCREEN_HALF_W,
        y: SCREEN_HALF_H,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
      text: 'LOADING :)',
    });

    this.progressBarText = gameObjectFactory.createText(this, {
      fontSize: 100,
      color: 'white',
      position: {
        x: SCREEN_HALF_W,
        y: SCREEN_HALF_H + 100,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
      text: '%',
    });

    this.loadingContainer.add([
      this.loadingText,
      this.progressBarText,
    ]);

    this.initializeManagers();
    this.addAssetsToLoadQueue();
    this.startAssetLoader();
    this.startHowlerLoader();
  }

  private initializeManagers() {
    this.assetLoaderManager = AssetLoaderManager.getInstance(this);
    this.howlerLoader = HowlerLoader.getInstance();
    this.animationManager = AnimationManager.getInstance(this);
    this.sceneManager = SceneManager.getInstance(this.game);
  }

  private addAssetsToLoadQueue() {
    [...SPRITE_SHEET_LAYOUTS, ...ANIMATION_LOADING_LAYOUTS].forEach(
      (layout) => {
        this.assetLoaderManager.loadSpriteSheet({
          key: layout.key,
          atlasDataPath: layout.atlasDataPath,
          imagePath: layout.imagePath,
        });
      },
    );

    this.assetLoaderManager.loadSpine(spineConfig);
  }

  private startAssetLoader() {
    this.assetLoaderManager.start(
      (progress: string) => {
        this.progressBarText.setText(progress);
      },
      () => this.afterLoadAssets(),
      () => this.errorLoadingAssets(),
    );
  }

  private startHowlerLoader() {
    this.howlerLoader.load(
      [
        {
          name: SoundLoadingKey.CAMERA_ZOOM,
          url: 'assets/sounds/camera56.mp3',
        },
        {
          name: SoundLoadingKey.CLICK,
          url: 'assets/sounds/click56.mp3',
        },
        {
          name: SoundLoadingKey.FINE,
          url: 'assets/sounds/fine56.mp3',
        },
        {
          name: SoundLoadingKey.LOOP,
          url: 'assets/sounds/loop56.mp3',
        },
        {
          name: SoundLoadingKey.FIREWORKS,
          url: 'assets/sounds/salut56.mp3',
        },
      ],
      () => {
        this.afterLoadSounds();
      },
    );
  }

  private afterLoadAssets() {
    this.isPhaserCompleteLoading = true;
    this.tryLoadingGame();
  }

  private afterLoadSounds() {
    this.isHowlerCompleteLoading = true;
    this.tryLoadingGame();
  }

  private tryLoadingGame() {
    if (!this.isHowlerCompleteLoading || !this.isPhaserCompleteLoading) {
      return;
    }

    (window as ApiWrapper).playableLoaded();

    this.destroyOnLoad();
    this.animationManager.registrationAnimation();
    this.sceneManager.start(SceneType.GAME);
  }

  private destroyOnLoad() {
    [
      this.loadingText,
      this.progressBarText,
      this.loadingContainer,
    ].forEach((value) => {
      value.destroy(true);
    });
  }

  private errorLoadingAssets() {
    console.log('Error while loading assets ;(');
  }

  public create() {}
}
