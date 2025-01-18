import { GameObjects, Tweens } from "phaser";
import { TitleOverlay } from "./TitleOverlay";
import { GameData, GameOptions } from "./GameOptions";
import { Sprite } from "./GameObjects/Sprite";
import { SpinWheel } from "./SpinWheel";
import { CoinShower } from "./CoinShower";
import { GraphicButton } from "./GameObjects/GraphicButton";
import { Button } from "./GameObjects/Button";

export class PlayGame extends Phaser.Scene {
    private wheel: SpinWheel;
    isSpinPressed: Boolean = false;
    soundManager: any;
    selectedItem: number = -1;
    wheel_cont: GameObjects.Container;

    constructor() {
        super({
            key: 'PlayGame'
        });
    }

    async create() {

        let g_width = GameOptions.gameSize.width;
        let g_height = GameOptions.gameSize.height;

        let bgimage = new Sprite(this, g_width / 2, g_height / 2, "background");
        bgimage.setOrigin(0.5);
        bgimage.scale = g_width / bgimage.width;
        this.add.existing(bgimage);

        // this.addSpinWheel();

        let buttonSize = { width: 350, height: 80 };
        let button_posi = { x: g_width / 2, y: 870 };

        let btn = new Button(this);
        btn.create(button_posi.x, button_posi.y, buttonSize.width, buttonSize.height, this.onSpinClick.bind(this));
        btn.addText('Click To Spin');
        this.add.existing(btn);


        const pointer = new Sprite(this, g_width / 2, 80, 'pointer')
        this.add.existing(pointer);

        this.wheel = new SpinWheel(this);
        this.wheel.x = g_width / 2;
        this.wheel.y = g_height / 2 - 100;
        this.wheel.setScale(.7);

        // let titleOverlay = new TitleOverlay(this);

        let shower = new CoinShower(this);
        shower.launchCoin();

        this.game_update();
    }

    game_update(): void {
        this.time.addEvent({
            delay: 1 / 60,
            callback: () => {
                this.wheel.onUpdate(.016);
            },
            callbackScope: this,
            loop: true
        });
    }

    onSpinClick() {
        if (!this.isSpinPressed) {
            // this.isSpinPressed = true;
            // this.soundManager.playSound(1);
            let indx = this.getRandWeight(GameData.weight);
            console.log(GameData.weight[indx], GameData.credits[indx]);
            if (this.selectedItem == -1) {
                // this.spinWheel(indx);
                this.wheel.spin(indx);
            }
            else {
                this.spinWheel(this.selectedItem)
            }
        }

    }

    spinWheel(stopAtIndex: number) {
        let final = (360 - stopAtIndex * 45) + (360 * 1);

        let cur_angle = this.wheel_cont.angle;
        let times = Math.floor(cur_angle / 360);
        cur_angle -= 360 * times;
        final = final - cur_angle;

        this.tweens.add({
            targets: this.wheel_cont,
            angle: cur_angle + final,
            duration: 2000,
            ease: 'Cubic.InOut',
            onComplete: () => {
                this.isSpinPressed = false;
            },
        });
    }

    getRandWeight(weights: number[]) {
        let totalWeight = 0, i, random;
        for (i = 0; i < weights.length; i++) {
            totalWeight += weights[i];
        }
        random = Math.random() * totalWeight;
        for (i = 0; i < weights.length; i++) {
            if (random < weights[i]) {
                return i;
            }
            random -= weights[i];
        }
        return -1;
    }
}