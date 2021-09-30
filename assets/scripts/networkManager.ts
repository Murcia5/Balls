
import { _decorator, Component, Node, Vec2, Prefab, instantiate, director, Vec3 } from 'cc';
import { PlayerBall } from './playerBall';
const { ccclass, property } = _decorator;

@ccclass('NetworkManager')
export class NetworkManager extends Component {
    
    static ws: WebSocket;
    static players : Map<string, PlayerBall> = new Map<string, PlayerBall>();
    static instance : NetworkManager;
    static playerName : string;
    static ipAddress : string = "localhost";

    @property({type:PlayerBall}) player : PlayerBall;
    @property({type:Prefab}) playerBallPrefab : Prefab;

    start () {
        console.log("Player name = " + NetworkManager.playerName);
        NetworkManager.instance = this;
        NetworkManager.ws = new WebSocket("ws://" + NetworkManager.ipAddress + ":8080");
        NetworkManager.ws.onopen= this.onOpen;
        NetworkManager.ws.onmessage= this.onMessage;
    }

    static killPlayer(playerBall : PlayerBall)
    {
        console.log("Player " + playerBall.pid + " killed!");
        var json = JSON.stringify({
            kill: playerBall.pid
        });
        NetworkManager.ws.send(json);
    }

    onOpen(event: MessageEvent<any>) {
        console.log("Connected!");
    }

    onMessage(event: MessageEvent<any>)
    {
        //console.log(event.data);
        var json = JSON.parse(event.data);

        if (json.hasOwnProperty("pid") && !json.hasOwnProperty("direction"))
        {
            NetworkManager.instance.player.pid = json["pid"];
            NetworkManager.players.set(NetworkManager.instance.player.pid, NetworkManager.instance.player);
            console.log("pid = " + NetworkManager.instance.player.pid);
        }
        else
        {
            if (NetworkManager.players.has(json["kill"])) {
                NetworkManager.players.forEach((player, key) => {
                    if (json["kill"] == key) 
                    {
                        if (NetworkManager.instance.player.pid == key)
                        {
                            var cam = player.node.getChildByName("Camera");
                            cam.parent = player.node.parent;
                            console.log("Game over...");
                        }

                        if (player != null)
                        {
                            player.node.destroy();
                        }
                    }
                    NetworkManager.players.delete(json["kill"]);
                });

            } 
            else if (NetworkManager.players.has(json["pid"])) {
                NetworkManager.players.forEach(player => {
                    if (json["pid"] == player.pid) {
                        var dx = parseFloat(json["direction"]["x"]);
                        var dy = parseFloat(json["direction"]["y"]);
                        player.direction = new Vec2(dx,dy);

                        var size = parseFloat(json["size"]);
                        if (player.size != size)
                        {
                            player.size = size;
                            player.updateBall();
                        }
                    }
                });
            }
            else
            {
                var player = instantiate(NetworkManager.instance.playerBallPrefab);
                director.getScene().addChild(player);
                var ball = player.getComponent(PlayerBall);
                ball.pid = json["pid"];
                ball.size = parseFloat(json["size"]);
                var pos = new Vec3(parseFloat(json["posx"]), parseFloat(json["posy"]), 0);
                ball.node.position = pos;
                var dx = parseFloat(json["direction"]["x"]);
                var dy = parseFloat(json["direction"]["y"]);
                ball.direction = new Vec2(dx,dy);
                ball.updateBall();
                NetworkManager.players.set(ball.pid, ball);
                console.log("Player loaded! " + ball.pid);
            }

        }
    }

}
