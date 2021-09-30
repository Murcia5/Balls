
import { _decorator, Component, Node, systemEvent, SystemEvent, EventMouse, Vec2, Color, Graphics, game, Rect, Vec3, UITransform, clamp, Collider2D, ICollisionEvent, Collider, find, Label, Canvas } from 'cc';
import { Ball } from './ball';
import { MiniBall } from './miniBall';
import { NetworkManager } from './networkManager';
const { ccclass, property } = _decorator;
 
@ccclass('PlayerBall')
export class PlayerBall extends Ball {

	public pid: string;
    direction : Vec2 = Vec2.ZERO;
    background : UITransform;
    
    @property controlEnabled : boolean = false;
    @property speed : number = 500;
    @property({type:Label}) label : Label;

    start () {
        super.start();
        if (this.controlEnabled)
        {
            var collider = this.getComponent(Collider);
            collider.on("onTriggerEnter", this.onTriggerEnter, this);
            collider.on("onTriggerStay", this.onTriggerStay, this);
            systemEvent.on(SystemEvent.EventType.MOUSE_MOVE, this.onMouseMoved, this);
            if (this.label != null)
            {
                this.label.string = NetworkManager.playerName;
            }
        }
        else
        {

        }
    }

    onLoad()
    {
        if (this.background == null)
        {
            this.background = find("/Canvas/Background").getComponent(UITransform);
            this.node.parent = this.background.node.parent;
            this.node.position = Vec3.ZERO;
        }
    }

    onTriggerEnter (event: ICollisionEvent) {
        if(event.otherCollider.getComponent(MiniBall) != null)
        {
            event.otherCollider.node.destroy();
            this.size += 0.5;
            this.updateBall();
        }
    }

    onTriggerStay (event: ICollisionEvent) {
        var otherPlayer = event.otherCollider.getComponent(PlayerBall);
        if (otherPlayer != null && this.size > otherPlayer.size)
        {
            var dis = Vec3.distance(this.node.position, otherPlayer.node.position);
            if (dis < this.size)
            {
                NetworkManager.killPlayer(otherPlayer);
                this.size += otherPlayer.size / 6;
                this.updateBall();
                event.otherCollider.node.destroy();
            }
        }
    }

    onMouseMoved(event: EventMouse) {
        if (NetworkManager.instance.player.pid != undefined)
        {
            var canvas = this.background.node.parent.getComponent(UITransform);
            var x = event.getLocationX() - canvas.width;
            var y = event.getLocationY() - canvas.height;
            if (x != undefined)
            {
                var dir = new Vec2(x,y).normalize();
                var json = JSON.stringify({
                    direction: dir,
                    size: this.size,
                    pid: this.pid,
                    posx: this.node.position.x,
                    posy: this.node.position.y
                });
                NetworkManager.ws.send(json);
            }
        }
    }

    update (dt: number) {
        var pos = this.node.position;
        var speedFactor = this.speed / this.size;
        var x = pos.x + this.direction.x * dt * speedFactor;
        var y = pos.y + this.direction.y * dt * speedFactor;
        var ballSize = this.size + this.borderWidth / 2;
        
        x = clamp(x, -this.background.width / 2 + ballSize, this.background.width / 2 - ballSize);
        y = clamp(y, -this.background.height / 2 + ballSize, this.background.height / 2 - ballSize);
            
        this.node.position = new Vec3(x,y,0);
        
        //console.log(PlayerBall.direction.x + "," + PlayerBall.direction.y);
    }

    onDestroy()
    {
        var graphic = this.getComponent(Graphics);
        graphic.clear();
    }

}
