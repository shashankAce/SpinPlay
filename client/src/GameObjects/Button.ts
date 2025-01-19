import { GameObjects } from "phaser";
import { GraphicButton } from "./GraphicButton";

export class Button extends GameObjects.Container {
    private clickEnabled: boolean = true;

    constructor(scene: Phaser.Scene) {
        super(scene);
        scene.add.existing(this);
    }

    public id = 0;
    private button_x = 0;
    private button_y = 0;
    private button_width = 0;
    private button_height = 0;
    private funcCallback: Function;

    create(x: number, y: number, width: number, height: number, callback: Function) {

        this.button_x = -width / 2;
        this.button_y = -height / 2;
        this.button_width = width;
        this.button_height = height;
        this.funcCallback = callback;

        let button = new GraphicButton(this.scene);
        button.create(this.button_x, this.button_y, width, height, this.onClick.bind(this));
        this.add(button);

        this.x = x;
        this.y = y;
    }

    disableClick(bool: boolean) {
        this.clickEnabled = !bool;
    }

    addText(msg: string, fillStyle?: Phaser.Types.GameObjects.Text.TextStyle) {
        let fontSize = 40;
        if (fillStyle == undefined) {
            fillStyle = {
                fontSize: `bold ${fontSize}px`,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
            }
        }
        let label = new GameObjects.Text(this.scene, this.button_x + this.button_width / 2, this.button_y + this.button_height / 2, msg, fillStyle).setOrigin(0.5);
        this.add(label);
    }

    async scaleEffect() {
        return new Promise((resolve: Function, reject) => {
            this.scene.tweens.chain({
                targets: null,
                tweens: [
                    {
                        targets: this,
                        scale: 1.1,
                        // ease: 'Cubic.In',
                        ease: 'Linear',
                        duration: 100,
                        repeat: 0,
                        yoyo: false
                    },
                    {
                        targets: this,
                        scale: 1,
                        // ease: 'Cubic.Out',
                        ease: 'Linear',
                        duration: 100,
                        repeat: 0,
                        yoyo: false
                    },
                    // ...
                ],

                delay: 0,
                completeDelay: 0,
                loop: 0,
                repeat: 0,
                repeatDelay: 0,
                paused: false,
                persist: true,
                callbackScope: this,
                onComplete: () => {
                    resolve();
                }
            })
        })
    }

    async onClick() {
        if (!this.clickEnabled) return;
        this.scene.sound.play("wheel-click");
        await this.scaleEffect();
        this.funcCallback && this.funcCallback(this);
    }
}