// CLASS TO PRELOAD ASSETS

import { GameObjects } from "phaser";
import { Config } from "./Config";

// PreloadAssets class extends Phaser.Scene class
export class PreloadAssets extends Phaser.Scene {

    // constructor    
    constructor() {
        super({
            key: 'PreloadAssets'
        });
    }

    // method to be called during class preloading
    preload(): void {
        this.load.image('background', 'assets/images/background.png');
    }

    // method to be executed when the scene is created
    create(): void {

        // load image
        this.load.image('pointer', 'assets/images/pointer.png');
        this.load.image('wheel_center', 'assets/images/wheel-center.png');
        this.load.image('wheel_slice', 'assets/images/wheel-slice.png');
        this.load.animation('coin-anim', "assets/images/coin-anim.json");
        this.load.spritesheet('coin', 'assets/images/coin-anim.png', {
            frameWidth: 200, // Frame width of the sprite in the PNG
            frameHeight: 200 // Frame height of the sprite in the PNG
        });

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        let progress_w = 800;
        let progress_h = 20;
        let margin = 8;

        let bgimage = this.add.image(width / 2, height / 2, "background");
        bgimage.setOrigin(0.5);
        bgimage.scale = width / bgimage.width;

        let msg = new GameObjects.Text(this, width / 2, height * 0.1, 'This Is Loading Screen', {
            fontSize: '60px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.add.existing(msg);

        let progressBox = this.add.graphics();
        progressBox.clear();
        progressBox.fillStyle(Config.progress_bg_color, 1); //ff00d9
        progressBox.fillRect(width / 2 - progress_w / 2, height * 0.7, progress_w, progress_h);

        let progressBar = this.add.graphics();

        let loadingText = this.add.text(width / 2, height * 0.77, 'Loading...', {
            fontSize: '30px',
            color: '#ffffff'
        }).setOrigin(0.5);

        let percentText = this.add.text(width / 2, height * 0.8, '0%', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        let currentProgress = { value: 0 };
        let isSceneLoaded = false;
        this.load.on('progress', (value: number) => {
            // percentText.setText((value * 100) + '%');
            // progressBar.clear();
            // progressBar.fillStyle(0xffffff, 1);
            // progressBar.fillRect(width / 2 - progress_w / 2 + margin / 2, height * 0.7 + margin / 2, progress_w * value - margin, progress_h - margin);

            //using tween
            this.tweens.add({
                targets: currentProgress,
                value: value, // Target value is the actual loading progress
                duration: 300, // Duration of the tween in milliseconds
                ease: 'Linear',
                onUpdate: () => {
                    // Clear the progress bar and redraw it with the tweened value
                    let p_value = Math.floor(currentProgress.value * 100);
                    percentText.setText(p_value + '%');
                    progressBar.clear();
                    progressBar.fillStyle(Config.progress_filler_color, 1); // White fill color
                    progressBar.fillRect(width / 2 - progress_w / 2 + margin / 2, height * 0.7 + margin / 2, progress_w * currentProgress.value - margin, progress_h - margin);

                    if (p_value == 100 && !isSceneLoaded) {
                        isSceneLoaded = true;
                        this.scene.start('PlayGame');
                    }
                }
            });
        });

        this.load.on('complete', () => {
            // progressBar.destroy();
            // progressBox.destroy();
            // loadingText.destroy();
            // percentText.destroy();
        });

        this.load.start();

    }
}