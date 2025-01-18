import { GameObjects } from "phaser";
import { GameOptions, GameData } from "./GameOptions";
import { Sprite } from "./GameObjects/Sprite";

export class SpinWheel extends GameObjects.Container {
    isSpinPressed: boolean = false;

    constructor(scene: Phaser.Scene) {
        super(scene);
        scene.add.existing(this);

        this.create();
    }

    private create() {
        let g_width = GameOptions.gameSize.width;
        let g_height = GameOptions.gameSize.height;

        this.x = g_width / 2;
        this.y = g_height / 2 - 100;
        this.setScale(.7);

        let angle = 45;
        for (let index = 0; index < GameData.credits.length; index++) {
            const element = GameData.credits[index];

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

    spin(stopAtIndex: number) {

        if (this.isSpinPressed)
            return;

        this.isSpinPressed = true;

        let final = (360 - stopAtIndex * 45) + (360 * 4);
        let cur_angle = this.angle;

        let times = Math.floor(cur_angle / 360);
        cur_angle -= 360 * times;
        final = final - cur_angle;

        let deaccelerate = this.scene.tweens.add({
            targets: this,
            angle: final,
            duration: 2000,
            ease: 'Cubic.Out',
            paused: true,
            onComplete: () => {
                this.isSpinPressed = false;
            }
        });

        let constant = this.scene.tweens.add({
            targets: this,
            angle: 360 * 1,
            duration: 1000 * 1,
            ease: 'Linear',
            paused: true,
            onComplete: () => {
                deaccelerate.play();
            }
        });

        this.scene.tweens.add({
            targets: this,
            angle: 360 * 1,
            duration: 1000 * 1,
            ease: 'Cubic.In',
            onComplete: () => {
                constant.play();
            }
        });
    }

    private maxSpeed = 360;
    private timeToMax = 2000
    private acc = this.maxSpeed / this.timeToMax;
    private startSpin = false;
    private currentSpeed = 0;
    private currentAngle = 0;


    onUpdate(delta: number) {
        if (!this.startSpin) return;


        // this.currentAngle += acc;
        this.angle += this.currentAngle;



    }
}