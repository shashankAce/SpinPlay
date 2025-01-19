import { GameObjects } from "phaser";
import { Config, GameData } from "./Config";
import { Sprite } from "./GameObjects/Sprite";


enum WHEEL_STATE {
    IDLE,
    ACCLERATE,
    CONTSTANT,
    DEACCLERATE
}

export class SpinWheel extends GameObjects.Container {
    private isSpinPressed: boolean = false;

    constructor(scene: Phaser.Scene) {
        super(scene);
        scene.add.existing(this);

        this.create();
    }

    private create() {
        let g_width = Config.gameSize.width;
        let g_height = Config.gameSize.height;

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

        let rota_count = 8;

        let final = (360 - stopAtIndex * 45) + (360 * rota_count);
        let cur_angle = this.angle;

        let times = Math.floor(cur_angle / 360);
        cur_angle -= 360 * times;
        final = final - cur_angle;

        this.scene.tweens.add({
            targets: this,
            angle: cur_angle + final,
            duration: 10000,
            ease: 'Cubic.InOut',
            onComplete: () => {
                this.isSpinPressed = false;
            }
        });
    }

    // spinWheel(stopAtIndex: number) {
    //     this.startSpin = true;

    //     // Rotation setup
    //     // this.angle = Phaser.Math.Between(50, 350);

    //     this.currentAngle = this.angle; // Current angle of the sprite
    //     this.rotationSpeed = 0; // Current rotational speed in degrees per second
    //     this.maxSpeed = 360; // Target maximum speed in degrees per second
    //     this.accelerationTime = 3; // Time to reach max speed in seconds
    //     this.decelerationTime = 2; // Time to stop in seconds
    //     this.timeStep = 1 / Config.fps; // Time per frame in seconds
    //     this.acceleration = this.maxSpeed / this.accelerationTime; // Degrees per second squared


    //     this.finalAngle = (360 - stopAtIndex * 45); // Target final angle
    //     // this.deceleration = this.maxSpeed / this.decelerationTime; // Degrees per second squared

    //     this.w_state = WHEEL_STATE.ACCLERATE;



    //     // let final = (360 - stopAtIndex * 45);
    //     // this.targetAngle = final;
    //     // this.angle = final;

    // }

    // onUpdate(delta: number) {
    //     if (!this.startSpin) return;

    //     if (this.w_state === WHEEL_STATE.ACCLERATE) {
    //         this.rotationSpeed += this.acceleration * this.timeStep;

    //         if (this.rotationSpeed >= this.maxSpeed) {
    //             this.rotationSpeed = this.maxSpeed;
    //             this.w_state = WHEEL_STATE.DEACCLERATE;
    //             // this.deceleration = -(this.maxSpeed ** 2) / (2 * this.finalAngle);
    //             this.deceleration = -((this.maxSpeed ** 2)) / (2 * this.finalAngle);
    //         }
    //     }

    //     if (this.w_state === WHEEL_STATE.DEACCLERATE) {

    //         this.rotationSpeed += this.deceleration * this.timeStep;
    //         if (this.rotationSpeed <= 0) {
    //             this.rotationSpeed = 0;
    //             this.w_state = WHEEL_STATE.IDLE;
    //         }
    //     }

    //     if (this.w_state == WHEEL_STATE.IDLE) {
    //         this.rotationSpeed = 0;
    //     }

    //     if (this.w_state == WHEEL_STATE.CONTSTANT) {
    //     }

    //     this.currentAngle += this.rotationSpeed * this.timeStep;
    //     this.currentAngle %= 360;
    //     this.angle = this.currentAngle;
    // }
}