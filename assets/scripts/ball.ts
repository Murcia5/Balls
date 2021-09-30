
import { _decorator, Component, Node, systemEvent, SystemEvent, EventMouse, Vec2, Color, Graphics, game, Rect, Vec3, CircleCollider2D, SphereCollider } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('Ball')
export abstract class Ball extends Component {

    colors : Array<Color> = new Array<Color>(8);

    @property size : number = 4;
    @property borderWidth : number = 2;
    @property color : Color = new Color(0, 0, 1, 1);
    @property borderColor : Color = new Color(0, 0, 0.5, 1);

    start () {
        this.colors[0] = Color.RED;
        this.colors[1] = Color.GRAY;
        this.colors[2] = Color.GREEN;
        this.colors[3] = Color.BLUE;
        this.colors[4] = Color.BLACK;
        this.colors[5] = Color.CYAN;
        this.colors[6] = Color.MAGENTA;
        this.colors[7] = Color.YELLOW;

        this.updateColor();
        this.updateBall();
    }

    updateColor()
    {
        var index : number = Math.round((Math.random() * 7));
        this.color = this.colors[index];
        this.borderColor = Color.BLACK;
        console.log(this.borderColor);
    }

    updateBall()
    {
        var graphic = this.getComponent(Graphics);
        graphic.clear();
        graphic.fillColor = this.color;
        graphic.strokeColor = this.borderColor;
        graphic.lineWidth = this.borderWidth;
        graphic.circle(0,0, this.size);
        graphic.stroke();
        graphic.fill();
        var collider = this.getComponent(SphereCollider);
        collider.radius = this.size + this.borderWidth / 2;
    }

}
