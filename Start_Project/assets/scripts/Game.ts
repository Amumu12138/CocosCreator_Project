
const {ccclass, property} = cc._decorator;

@ccclass
export class Game extends cc.Component {
    //star预制资源
    @property(cc.Prefab)
    private starPrefab: cc.Prefab = null;
    //star产生后消失时间的随机范围
    @property(cc.Integer)
    private maxStarDuration = 0;

    @property(cc.Integer)
    private minStarDuration = 0;

    //play按钮
    @property(cc.Button)
    private playBtn: cc.Button = null;
    //底面节点，用于确定星星生成的高度
    @property(cc.Node)
    private groundNode: cc.Node = null;
    // score Label 的引用
    @property(cc.Label)
    private scoreLabel: cc.Label = null;
    //Player节点，用于获取主角弹跳的高度，和控制主角行动
    @property(cc.Node)
    public playerNode: cc.Node = null;
    //得分音效资源
    @property(cc.AudioClip)
    private scoreAudio: cc.AudioClip = null;
    //地面节点的Y轴坐标
    private groundY: number;
    //定时器
    public timer: number;
    //星星存在持续时间
    public starDuration: number;
    //当前分数
    private score: number;

    protected onLoad () {
        //获取地面的Y轴坐标
        this.groundY = this.groundNode.y + this.groundNode.height / 2;
        //添加playBtn点击监听事件
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = "Game"; //这个是代码文件名
        clickEventHandler.handler = "onClickPlay";
        clickEventHandler.customEventData = "foobar";

        this.playBtn.clickEvents.push(clickEventHandler);
    }

    protected update (dt: number) {
        //每帧更新计时器
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    }

    /**
     * @description: play按钮点击回调事件
     */
    public onClickPlay() {
        this.playBtn.node.active = false;
         //初始化计时器
        this.timer = 0;
        this.starDuration = 0;
         //初始化计分
        this.score = 0;
        //主角初始化
        this.playerNode.getComponent('Player').init();
         //生成一颗新的星星
        this.spawnNewStar();
    }
    /**
     * @description: 生成一个新的星星
     */
    public spawnNewStar() {
        //生成新的节点
        let newStar = cc.instantiate(this.starPrefab);
        //将新增节点添加到场景中
        this.node.addChild(newStar);
        //为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        //将Star组件初始化
        newStar.getComponent("Star").init(this);
        //重置计时器
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }
    /**
     * @description: 生成星星的位置
     */
    public getNewStarPosition(){
        let randX = 0;
        let randY = this.groundY + Math.random() * this.playerNode.getComponent("Player").jumpHeight + 50;
        //根据屏幕宽度，随机得到一个星星x坐标
        let maxX = this.node.width / 2;
        randX = (Math.random() * 2 - 1) * maxX;
        return cc.p(randX, randY);
    }

   /**
    * @description: 游戏结束
    */
    public gameOver() {
        //停止player的跳跃动作
        this.playerNode.stopAllActions();  
        cc.director.loadScene('game');
    }

    /**
     *@description: 得分
     */
    public gainScore() {
        this.score += 1;
        //更新scoreDisplay Label的文字
        this.scoreLabel.string = "Score: " + this.score.toString();
        //播放得分音效
        cc.audioEngine.play(this.scoreAudio as any, false, 1);
    }

   


}
