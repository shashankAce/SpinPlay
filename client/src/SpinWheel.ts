import { GameObjects } from "phaser";
import { Config } from "./Config";
import { Sprite } from "./GameObjects/Sprite";
import { GAME_DATA } from "./PlayGame";

export class SpinWheel extends GameObjects.Container {
    private isSpinPressed: boolean = false;

    constructor(scene: Phaser.Scene) {
        super(scene);
        scene.add.existing(this);
    }

    create(gameData: GAME_DATA) {
        let g_width = Config.gameSize.width;
        let g_height = Config.gameSize.height;

        this.x = g_width / 2;
        this.y = g_height / 2 - 100;
        this.setScale(.7);

        let angle = 45;
        for (let index = 0; index < gameData.credits.length; index++) {
            const element = gameData.credits[index];

            const itemContainer = new GameObjects.Container(this.scene);
            const wheel_slice = new Sprite(this.scene, 0, 0, 'wheel_slice');
            wheel_slice.setOrigin(0.5, 1);

            let text = new GameObjects.Text(this.scene, 0, -190, `${element}`, {
                fontSize: 'bold 90px',
                color: '#000000'
            }).setOrigin(0, 0.5).setAngle(-90);

            itemContainer.angle = angle * index;
            itemContainer.add(wheel_slice);
            itemContainer.add(text);

            this.add(itemContainer);
        }

        const wheel = new Sprite(this.scene, 0, 0, 'wheel_center');
        // wheel.tint = 0x00FF00;
        this.add(wheel);
    }

    async spin(stopAtIndex: number) {
        return new Promise((resolve: Function, reject) => {

            if (this.isSpinPressed)
                return;

            this.isSpinPressed = true;

            let rota_count = 8;

            let final = (360 - stopAtIndex * 45) + (360 * rota_count);
            let cur_angle = this.angle;

            let times = Math.floor(cur_angle / 360);
            cur_angle -= 360 * times;
            final = final - cur_angle;

            let deaceleration = this.scene.tweens.add({
                targets: this,
                angle: cur_angle + final,
                duration: 4000,
                ease: 'Cubic.Out',
                paused: true,
                onComplete: () => {
                    this.isSpinPressed = false;
                    resolve();
                }
            });
            this.scene.tweens.add({
                targets: this,
                angle: 360 * 3,
                duration: 2000,
                ease: 'Cubic.In',
                onComplete: () => {
                    deaceleration.play();
                }
            });
        });

    }
}