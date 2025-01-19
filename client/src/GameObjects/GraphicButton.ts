import { GameObjects } from "phaser";
import { Config } from "../Config";

export class GraphicButton extends GameObjects.Graphics {

    private _callback: Function;

    create(x: number, y: number, width: number, height: number, callback: Function) {
        this._callback = callback;

        this.clear();
        this.fillStyle(Config.buton_color, 1);
        this.fillRect(x, y, width, height);

        this.setInteractive(
            new Phaser.Geom.Rectangle(
                x, y, width, height
            ),
            Phaser.Geom.Rectangle.Contains
        );
        this.on('pointerdown', this.onClick);
    }

    onClick() {
        this._callback && this._callback();
    }
}