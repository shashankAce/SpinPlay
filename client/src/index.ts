import { AUTO, Game, Scale, Types } from "phaser";
import { Config } from "./Config";
import { PlayGame } from "./PlayGame";
import { PreloadAssets } from "./PreloadAssets";

const scaleObject: Types.Core.ScaleConfig = {
    mode: Scale.FIT,                     // adjust size to automatically fit in the window
    autoCenter: Scale.CENTER_BOTH,       // center the game horizontally and vertically
    parent: 'gamediv',                   // DOM id where to render the game
    width: Config.gameSize.width,        // game width, in pixels
    height: Config.gameSize.height       // game height, in pixels
};

// game configuration object
const configObject: Types.Core.GameConfig = {
    type: AUTO,                          // game renderer
    backgroundColor: Config.gameBackgroundColor,  // game background color
    scale: scaleObject,
    fps: {
        target: 60,
        forceSetTimeOut: false
    },
    scene: [                             // array with game scenes
        PreloadAssets,                   // PreloadAssets scene
        PlayGame                         // PlayGame scene
    ]
};

// the game itself
new Game(configObject);