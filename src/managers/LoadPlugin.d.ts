import type Phaser from 'phaser';

export interface LoadPlugin extends Phaser.Loader.LoaderPlugin {
    spine: (key: string, jsonUrl: string, atlasUrl: string) => void;
}
