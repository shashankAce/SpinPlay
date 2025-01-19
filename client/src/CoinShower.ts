import { Animations, GameObjects } from "phaser";
import { Sprite } from "./GameObjects/Sprite";
import { Config } from "./Config";

export class CoinShower extends GameObjects.Group {

    constructor(scene: Phaser.Scene) {
        super(scene);
        scene.add.existing(this);
        this.classType = Sprite;
        this.create();
    }

    create() {
        this.scene.anims.create({
            key: 'spin',
            frames: this.scene.anims.generateFrameNumbers('coin', {
                start: 0,
                end: 5,
            }),
            frameRate: 30,
            repeat: -1
        });

        for (let i = 0; i < 50; i++) {
            let coin = new Sprite(this.scene, 0, 0, 'coin');
            coin.setActive(false).setVisible(false);
            this.add(coin);
        }
    }

    launchCoin() {
        this.resetCoins();
        this.scene.time.addEvent({
            delay: 100,
            callback: this.dropCoin,
            callbackScope: this,
            loop: true
        });
    }

    private resetCoins() {
        this.getChildren().forEach((coins, index) => {
            (coins as Sprite).setPosition(0, 0);
            (coins as Sprite).setActive(false).setVisible(false);
        })
    }

    private dropCoin() {
        // Get an inactive coin from the pool
        const coin = this.getFirstDead();

        if (coin) {
            coin.setActive(true).setVisible(true);
            const x = Phaser.Math.Between(50, Config.gameSize.width - 50);
            coin.setPosition(x, -200);
            coin.angle = Phaser.Math.Between(-20, 90);
            coin.setScale(0.5);
            coin.play('spin');
            coin.anims.frameRate = Phaser.Math.Between(5, 10);

            // Make the coin fall
            this.scene.tweens.add({
                targets: coin,
                y: Config.gameSize.height + 200,
                duration: Phaser.Math.Between(1000, 2000),
                onComplete: () => {
                    // coin.setActive(false).setVisible(false);
                }
            });
        }
    }
}