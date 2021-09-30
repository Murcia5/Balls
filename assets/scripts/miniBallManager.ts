
import { _decorator, Component, Node, UITransform, game, director, Prefab, instantiate, randomRange, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('MiniBallManager')
export class MiniBallManager extends Component {
    
    @property minSpawnDelay : number = 1;
    @property maxSpawnDelay : number = 3;

    @property({type:UITransform}) background : UITransform;
    @property({type:Prefab}) miniBall : Prefab;

    start () {
        this.scheduleSpawn();
    }

    scheduleSpawn() {
        director.getScheduler().schedule(this.spawnMiniBall, this, 
            (this.minSpawnDelay + Math.random() * this.maxSpawnDelay));
    }

    spawnMiniBall()
    {
        this.scheduleSpawn();
        var miniBall = instantiate(this.miniBall) as Node;
        director.getScene().addChild(miniBall);
        miniBall.parent = this.background.node.parent;
        var x = randomRange(-this.background.width / 2, this.background.width / 2);
        var y = randomRange(-this.background.height / 2, this.background.height / 2);
        miniBall.position = new Vec3(x,y,0);
    }
}
