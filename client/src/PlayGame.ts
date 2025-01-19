import { GameObjects, Tweens } from "phaser";
import { TitleOverlay } from "./TitleOverlay";
import { Config } from "./Config";
import { Sprite } from "./GameObjects/Sprite";
import { SpinWheel } from "./SpinWheel";
import { CoinShower } from "./CoinShower";
import { GraphicButton } from "./GameObjects/GraphicButton";
import { Button } from "./GameObjects/Button";
import { clientEvent } from "./EventListener/clientEvent";
import { EventName } from "./EventListener/EventName";
import { Presets } from "./Presets";
import { resolve } from "../../webpack.config";

export type GAME_DATA = {
    credits: number[],
    weight: number[],
    presets: number[]
}

export class PlayGame extends Phaser.Scene {
    private wheel: SpinWheel;
    private soundManager: any;
    private gameData: GAME_DATA;

    private isSpinPressed: Boolean = false;

    private fpsLabel: GameObjects.Text;
    private lastUpdateTime: number;
    private frameCount: number;

    private presetLabel: GameObjects.Text;
    private presetValue: number = -1;

    private winningLabel: GameObjects.Text;

    private creditsLabel: GameObjects.Text;
    private creditsValue: number = 0;
    private coinShower: CoinShower;

    constructor() {
        super({
            key: 'PlayGame'
        });

        clientEvent.on(EventName.preset_pick, this.applyPreset, this);
    }

    async create() {
        this.gameData = this.cache.json.get('configuration');

        let g_width = Config.gameSize.width;
        let g_height = Config.gameSize.height;

        let bgimage = new Sprite(this, g_width / 2, g_height / 2, "background");
        bgimage.setOrigin(0.5);
        bgimage.scale = g_width / bgimage.width;
        this.add.existing(bgimage);

        let buttonSize = { width: 350, height: 80 };
        let button_posi = { x: g_width / 2, y: 1000 };

        let btn = new Button(this);
        btn.create(button_posi.x, button_posi.y, buttonSize.width, buttonSize.height, this.onSpinClick.bind(this));
        btn.addText('PRESS TO SPIN');
        this.add.existing(btn);


        const pointer = new Sprite(this, g_width / 2, 185, 'pointer');
        this.add.existing(pointer);

        this.wheel = new SpinWheel(this);
        this.wheel.create(this.gameData);
        this.wheel.x = g_width / 2;
        this.wheel.y = g_height / 2;
        this.wheel.setScale(.7);

        let dropDown = new Presets(this);
        dropDown.create(this.gameData);
        dropDown.setPosition(Config.gameSize.width - 200, 70);

        this.presetLabel = new GameObjects.Text(this, Config.gameSize.width - 20, Config.gameSize.height - 200, '', {
            fontSize: '50px',
            color: '#00ff00'
        }).setOrigin(1, 0.5);
        this.add.existing(this.presetLabel);

        // Initialize variables for FPS tracking
        this.lastUpdateTime = performance.now(); // Time of the last update
        this.frameCount = 0; // Counts frames within a secon

        let titleOverlay = new TitleOverlay(this);
        this.coinShower = new CoinShower(this);

        this.creditsLabel = new GameObjects.Text(this, 20, 20, 'Credits Balance 0', {
            fontSize: '40px',
        }).setOrigin(0, 0);
        this.add.existing(this.creditsLabel);

        this.winningLabel = new GameObjects.Text(this, g_width / 2, 70, ``, {
            fontSize: '70px',
            color: '#ffffff',
            stroke: '#ff0000',
            strokeThickness: 4,
        }).setOrigin(0.5, 0);
        this.add.existing(this.winningLabel);

        this.fpsLabel = new GameObjects.Text(this, 100, g_height - 50, 'Fps', {
            fontSize: '20px',
            color: '#00ff00'
        }).setOrigin(0.5);
        this.add.existing(this.fpsLabel);

    }

    private applyPreset(preset: number) {
        if (this.isSpinPressed)
            return;
        this.presetValue = preset;
        this.presetLabel.setText(`Preset Applied ${preset}`);
    }

    async onSpinClick() {
        if (!this.isSpinPressed) {
            this.isSpinPressed = true;

            this.winningLabel.setText("");
            // this.soundManager.playSound(1);

            if (this.presetValue == -1) {

                let indx = this.getRandWeight(this.gameData.weight);
                this.presetLabel.setText(`Random Credit ${this.gameData.credits[indx]}`);

                await this.wheel.spin(indx);
                this.onSpinComplete(this.gameData.credits[indx]);

            }
            else {

                let index = this.gameData.credits.indexOf(this.presetValue);
                await this.wheel.spin(index);
                this.onSpinComplete(this.presetValue);
            }
        }

    }

    async onSpinComplete(value: number) {
        this.winningLabel.setText(`YOU WON ${value} CREDITS!`);
        this.coinShower.dropCoins();
        await this.addCredits(value);
        this.reset();
    }

    reset() {
        this.presetLabel.setText("");
        this.presetValue = -1;
        this.isSpinPressed = false;
    }

    private getRandWeight(weights: number[]) {
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

    update(time: number, delta: number): void {
        this.trackFps();
    }

    private trackFps() {
        this.frameCount++;
        const currentTime = performance.now();
        if (currentTime - this.lastUpdateTime >= 1000) {
            const fps = this.frameCount;
            this.fpsLabel.setText(`FPS: ${fps}`);
            this.frameCount = 0;
            this.lastUpdateTime = currentTime;
        }
    }

    async addCredits(value: number) {
        return new Promise((resolve: Function, reject) => {

            this.tweens.addCounter({
                from: this.creditsValue,
                to: this.creditsValue + value,
                ease: 'Linear',
                duration: 1000,
                onUpdate: (tween) => {
                    let value = Math.floor(tween.getValue());
                    this.creditsLabel.setText(`Credit Balance ${value}`);
                },
                onComplete: () => {
                    this.creditsValue += value;
                    resolve();
                }
            });
        })

    }
}