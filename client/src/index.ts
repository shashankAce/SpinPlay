import Phaser from "phaser";
import { Config } from "./Config";
import { PlayGame } from "./PlayGame";
import { PreloadAssets } from "./PreloadAssets";

const scaleObject: Phaser.Types.Core.ScaleConfig = {
    mode: Phaser.Scale.FIT,                     // adjust size to automatically fit in the window
    autoCenter: Phaser.Scale.CENTER_BOTH,             // center the game horizontally and vertically
    parent: 'gamediv',                            // DOM id where to render the game
    width: Config.gameSize.width,           // game width, in pixels
    height: Config.gameSize.height           // game height, in pixels
}

// game configuration object
const configObject: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,                      // game renderer
    backgroundColor: Config.gameBackgroundColor,  // game background color
    scale: scaleObject,
    scene: [                                 // array with game scenes
        PreloadAssets,                                  // PreloadAssets scene
        PlayGame                                        // PlayGame scene
    ]
}

// the game itself
new Phaser.Game(configObject);