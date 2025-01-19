import { GameObjects } from "phaser";
import { Config } from "./Config";
import { Sprite } from "./GameObjects/Sprite";
import { GraphicButton } from "./GameObjects/GraphicButton";

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


        let buttonSize = { x: 200, y: 50 };
        let button_posi = { x: g_width / 2 - buttonSize.x / 2, y: 800 };

        let button = new GraphicButton(this.scene);
        button.create(button_posi.x, button_posi.y, buttonSize.x, buttonSize.y, () => {
            button.disableInteractive();
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    console.log(' TitleOverlay Faded ');
                    this.destroy();
                }
            });
        });
        this.add(button);


        let fontSize = 20;
        let clickToPlay = new GameObjects.Text(this.scene, g_width / 2, button_posi.y + buttonSize.y / 2, 'Click to Play', {
            fontSize: `bold ${fontSize}px`,
            color: '#ffffff',
            stroke: '#ff00ff',
            strokeThickness: 4,
        }).setOrigin(0.5);
        this.add(clickToPlay);
    }
}