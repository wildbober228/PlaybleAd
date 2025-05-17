import type { SpriteSheetLoadingLayout } from '../animation-manager/constants.ts';

export const enum MainAssetsFrame {
  PLAY_BUTTON = 'bt_play.png',
  BLUE_GEM = 'ch_blue.png',
  GREEN_GEM = 'ch_green.png',
  PINK_GEM = 'ch_pink.png',
  RED_GEM = 'ch_red.png',
  YELLOW_GEM = 'ch_yellow.png',
  GAME_FIELD = 'field_1_vertical.png',
  LOGO = 'logo_portrait.png',
  BACKGROUND = 'map.png',
  NEXT_STAGE_BUTTON = 'button.png',
}

export const enum ImageLoadingKey {
 MAIN_ASSETS = "MAIN_ASSETS"
}

export type ImageAsset = {
  key: string;
  imagePath: string;
};

export type SpineFileConfig = {
  key: string;
  jsonUrl: string;
  atlasUrl: string;
};

export const SPRITE_SHEET_LAYOUTS: SpriteSheetLoadingLayout[] = [
  {
    key: ImageLoadingKey.MAIN_ASSETS,
    imagePath: 'images/mainAssets.png',
    atlasDataPath: 'images/mainAssets.json',
  },
];

export const IMAGE_LAYOUTS: ImageAsset[] = [
  // {
  //   key: ImageLoadingKey.BUTTON_BACKGROUND,
  //   imagePath: 'images/button.png',
  // },
];
