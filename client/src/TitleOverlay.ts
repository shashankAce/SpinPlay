import { GameObjects } from "phaser";
import { Config } from "./Config";
import { Sprite } from "./GameObjects/Sprite";
import { GraphicButton } from "./GameObjects/GraphicButton";
import { Button } from "./GameObjects/Button";
import { cli } from "webpack";

export class TitleOverlay extends GameObjects.Container {

    constructor(scene: Phaser.Scene) {
        super(scene);
        scene.add.existing(this);
        this.create();
    }

    private create() {

        let g_width = Config.gameSize.width;
        let g_height = Config.gameSize.height;

        let bgimage = new Sprite(this.scene, g_width / 2, g_height / 2, "background");
        bgimage.setButtonEnabled(true);
        bgimage.setOrigin(0.5);
        bgimage.scale = g_width / bgimage.width;
        this.add(bgimage);

        let msg = new GameObjects.Text(this.scene, g_width / 2, g_height * 0.1, 'This Is Title Screen', {
            fontSize: '60px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.add(msg);


        let title = new GameObjects.Text(this.scene, g_width / 2, g_height * 0.3, 'GAME TITLE', {
            fontSize: '50px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.add(title);




        let buttonSize = { width: 350, height: 80 };
        let button_posi = { x: g_width / 2, y: 800 };

        let clickToGameSceneBtn = new Button(this.scene);
        clickToGameSceneBtn.create(button_posi.x, button_posi.y, buttonSize.width, buttonSize.height, () => {
            this.hide();
        });

        clickToGameSceneBtn.addText('Click to Play', {
            fontSize: `bold 40px`,
            color: '#ffffff',
            stroke: '#ff00ff',
            strokeThickness: 4,
        });

        this.add(clickToGameSceneBtn);
    }

    hide() {
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 500,
            ease: 'Cubic.Out',
            onComplete: () => {
                console.log(' TitleOverlay Faded Out');
                this.active = false;
            }
        });
    }

    show(callback: Function) {
        this.scene.tweens.add({
            targets: this,
            alpha: 255,
            duration: 500,
            ease: 'Cubic.In',
            onComplete: () => {
                console.log(' TitleOverlay Faded In');
                this.active = true;
                callback && callback();
            }
        });
    }
}