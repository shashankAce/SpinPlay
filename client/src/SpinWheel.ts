import { GameObjects } from "phaser";
import { GameOptions, GameData } from "./GameOptions";
import { Sprite } from "./Sprite";

export class SpinWheel extends GameObjects.Container {

    private rotations = 3;               // Number of full rotations before stopping
    private maxSpeed = 360;              // Maximum speed in degrees per second (adjustable)
    private maxSpeedDuration = 2000;     // Duration to reach max speed (in ms)
    private constantSpeedDuration = 4000; // Duration to maintain max speed

    private anglePerSecond = 0;          // Current angular velocity (degrees per second)
    private targetAngle = 0;
    private currentAngle = 0;

    private elapsedTime = 0;             // Total elapsed time
    private accelerationTime = 0;        // Time spent in acceleration phase
    private constantSpeedTime = 0;       // Time spent in constant speed phase
    private decelerationTime = 0;        // Time spent in deceleration phase

    private isSpinning = false;           // Flag to control whether the wheel is still spinning
    private decelerationRate = 0.5;

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

    reset() {
        this.anglePerSecond = 0;          // Current angular velocity (degrees per second)
        this.targetAngle = 0;
        this.currentAngle = 0;

        this.elapsedTime = 0;             // Total elapsed time
        this.accelerationTime = 0;        // Time spent in acceleration phase
        this.constantSpeedTime = 0;       // Time spent in constant speed phase
        this.decelerationTime = 0;        // Time spent in deceleration phase

        this.isSpinning = false;           // Flag to control whether the wheel is still spinning
        this.decelerationRate = 0.5;
    }

    spin(stopAtIndex: number) {
        this.reset();

        this.targetAngle = (360 - stopAtIndex * 45) + (360 * this.rotations);
        let cur_angle = this.angle;
        let times = Math.floor(cur_angle / 360);
        cur_angle -= 360 * times;
        this.targetAngle = this.targetAngle - cur_angle;

        this.currentAngle = this.angle;
        this.isSpinning = true;
    }

    onUpdate(time: number, delta: number) {

        if (this.isSpinning) {
            // 1. Acceleration Phase (Increase angular velocity to maxSpeed)
            if (this.accelerationTime < this.maxSpeedDuration) {
                // Increase angular speed (linearly)
                this.anglePerSecond = this.maxSpeed * (this.accelerationTime / this.maxSpeedDuration);
                this.accelerationTime += delta;
            }
            // 2. Constant Speed Phase (Maintain max speed)
            else if (this.constantSpeedTime < this.constantSpeedDuration) {
                this.anglePerSecond = this.maxSpeed; // Maintain max speed
                this.constantSpeedTime += delta;
            }
            // 3. Deceleration Phase (Slow down smoothly to stop at target angle)
            else {
                // Calculate how much time has passed since the deceleration started
                let decelerationProgress = (this.decelerationTime / (this.maxSpeedDuration / 2));  // Half of maxSpeedDuration for deceleration
                if (decelerationProgress < 1) {
                    this.anglePerSecond = this.maxSpeed * (1 - decelerationProgress); // Gradually decrease speed
                    this.decelerationTime += delta;
                } else {
                    // Deceleration complete, stop at target angle
                    this.anglePerSecond = 0;
                    this.isSpinning = false; // Stop spinning
                }
            }

            // Update the wheel's angle
            this.angle += this.anglePerSecond * delta / 1000; // Convert delta to seconds

            // Normalize the angle to ensure it stays within 0-360 degrees
            this.angle = Phaser.Math.Wrap(this.angle, 0, 360);
        }

        // Ensure we stop precisely at the final angle
        if (!this.isSpinning && Math.abs(this.angle - this.currentAngle - this.targetAngle) < 0.1) {
            // Normalize the final angle before setting it
            this.angle = Phaser.Math.Wrap(this.currentAngle + this.targetAngle, 0, 360);
        }
    };
}