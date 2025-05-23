import { Game as MainGame } from './scenes/Game';
import { AUTO, Game, Scale,Types } from 'phaser';
import {UI} from "./scenes/UI.ts";
import {Boot} from "./scenes/Boot.ts";

const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#9cadb9',
    scale: {
        mode: Scale.RESIZE,
        autoCenter: Scale.CENTER_BOTH
    },
    scene: [Boot, MainGame, UI],
    plugins: {
       scene: [{ key: '../public/assets/lib/SpinePlugin.js', plugin: window.SpinePlugin, mapping: 'spine' }],
    },
};

export default new Game(config);
