import { Game } from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export class Star extends cc.Component {

    //star与主角plyaer的碰撞距离
    @property(cc.Integer)
    private pickRad: number = 0;

    private game: Game = null;


    protected update (dt:number) {
       
        //根据palyer和star之间的距离判断是否收集
        if (this.getPlayerDistance() < this.pickRad) {
            this.onPicked();
            return;
        }
        //
        let opacityRatio = 1 - this.game.timer / this.game.starDuration;
        let minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    }

    /**
     * @description: 赋值初始化
     * @param game ：Game脚本
     */
    public init(game: Game) {
        this.game = game;
    }

    /**
     * @description: 获取主角plyaer和star的距离
     */
    public getPlayerDistance() {
        //获取主角位置
        let playerPos = this.game.playerNode.getPosition();
        let dis = this.node.position.sub(playerPos).mag();
        return dis;
    }

    /**
     * @description: star被收集
     */
    public onPicked() {
        this.game.spawnNewStar();
        this.game.gainScore();
        this.node.destroy();
    }
}
