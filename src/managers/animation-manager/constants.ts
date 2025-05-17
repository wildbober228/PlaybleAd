import type {ImageLoadingKey} from '../game-object-factory/imageConstants.ts';

export const enum AnimationLoadingKey {
    FIREWORKS = 'FIREWORKS',
    HAND = 'HAND',
}

export type SpriteSheetLoadingLayout = {
    key: AnimationLoadingKey | ImageLoadingKey;
    imagePath: string;
    atlasDataPath: string;
};

export const ANIMATION_LOADING_LAYOUTS: SpriteSheetLoadingLayout[] = [
    {
      key: AnimationLoadingKey.FIREWORKS,
      imagePath: 'sequence/fireworks.png',
      atlasDataPath: 'sequence/fireworks.json',
    },
    {
        key: AnimationLoadingKey.HAND,
        imagePath: 'sequence/hand.png',
        atlasDataPath: 'sequence/hand.json',
    },
];
