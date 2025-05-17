import type { ImageAsset } from './game-object-factory/imageConstants.ts';
import {SpineFileConfig} from "./game-object-factory/imageConstants.ts";
import {LoadPlugin} from "./LoadPlugin";

type SpriteSheetAsset = {
  key: string;
  imagePath: string;
  atlasDataPath: string;
};

export class AssetLoaderManager {
  private loader: Phaser.Loader.LoaderPlugin;

  private static instance: AssetLoaderManager | null = null;

  private constructor(scene: Phaser.Scene) {
    this.loader = scene.load;
    this.loader.setPath('assets');
  }

  public static getInstance(scene: Phaser.Scene): AssetLoaderManager {
    if (AssetLoaderManager.instance) {
      return AssetLoaderManager.instance;
    }

    AssetLoaderManager.instance = new AssetLoaderManager(scene);
    return AssetLoaderManager.instance;
  }

  public loadImage(config: ImageAsset): this {
    this.loader.image(config.key, config.imagePath);
    return this;
  }

  public loadSpine(config: SpineFileConfig): this {
    (this.loader as LoadPlugin).spine(config.key, config.jsonUrl, config.atlasUrl);
    return this;
  }


  public loadSpriteSheet(config: SpriteSheetAsset): this {
    this.loader.atlas(config.key, config.imagePath, config.atlasDataPath);
    return this;
  }

  public start(
    onLoading?: (progress: string) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void,
  ): void {
    this.loader.on(Phaser.Loader.Events.PROGRESS, (progress: number) => {
      onLoading?.(`${Math.round(progress * 100)}%`);
    });

    this.loader.once(Phaser.Loader.Events.COMPLETE, () => {
      onComplete?.();
    });

    this.loader.once(
      Phaser.Loader.Events.FILE_LOAD_ERROR,
      (file: Phaser.Loader.File) => {
        const error = new Error(`Failed to load ${file.key}`);
        onError?.(error);
      },
    );

    this.loader.start();
  }
}
