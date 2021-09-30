
import { _decorator, Component, Node, EditBox, director } from 'cc';
import { NetworkManager } from './networkManager';
const { ccclass, property } = _decorator;
 
@ccclass('LoginManager')
export class LoginManager extends Component {

    @property({type:EditBox}) nameBox : EditBox;
    @property({type:EditBox}) addressBox : EditBox;

    okButtonPressed () {
        NetworkManager.playerName = this.nameBox.string;
        this.nameBox.node.parent.active = false;
        this.addressBox.node.parent.active = true;
        //director.loadScene("main");
    }

    connectButtonPressed () {
        NetworkManager.ipAddress = this.addressBox.string;
        director.loadScene("main");
    }
}
