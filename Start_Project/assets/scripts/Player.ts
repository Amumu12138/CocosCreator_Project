const {ccclass, property} = cc._decorator;

@ccclass
export class Player extends cc.Component {

    //主角跳跃高度
    @property(cc.Integer)
    private jumpHeight: number = 0;

    //主角持续跳跃时间
    @property(cc.Integer)
    private jumpDuration: number = 0;

    //最大移动速度
    @property(cc.Integer)
    private maxMoveSpeed: number = 0;

    //加速度
    @property(cc.Integer)
    private accel: number = 0;

    //跳跃音效资源
    @property(cc.AudioClip)
    private jumpAudio: cc.AudioClip = null;

    private xSpeed: number = 0;
    private accLeft: boolean = false;
    private accRight: boolean = false;
    private jumpAction: cc.Action = null;

    public init() {
        //初始化
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);

        //加速度方向
        this.accLeft = false;
        this.accRight = false;
        this.xSpeed = 0;
        
        //初始化监听
        this.addEventListeners();
    }


    protected update (dt: number) {
        //根据当前加速度方向更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        //限制主角速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        //根据当前速度更新主角代码
        this.node.x += this.xSpeed * dt;
        //主角不能越过屏幕
        if (Math.abs(this.node.x) - this.node.parent.width / 2 >= 0) {
            this.node.x = this.node.parent.width / 2 * (-1) *  this.node.x / Math.abs(this.node.x);
        }

    }
    
    /**
     * @description: 添加监听事件
     */
    private addEventListeners() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onStartTouch, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onEndTouch, this);
    }

    /**
     * @description: 控制主角持续跳跃
     */
    private setJumpAction() {
        //跳跃上升
        let jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        //跳跃下落
        let jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        //添加一个回调函数
        let callback = cc.callFunc(this.playJumpSound, this);
        //主角做持续跳跃
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    }

    /**
     * @description: 播放跳跃音效
     */
    private playJumpSound() {
        cc.audioEngine.play(this.jumpAudio as any, false, 1.0);
    }

    /**
     * @description: 主角移动
     * @param isLeft: 是否向左
     * @param isRight: 是否向右
     */
    private move(isLeft: boolean, isRight: boolean) {
        this.accLeft = isLeft;
        this.accRight = isRight;
    }

    /**
     * 
     * @description: 触碰屏幕开始回调事件
     * @param event: 触发事件 
     */
    private onStartTouch(event: cc.Event.EventTouch) {
        if (event.getLocationX() > cc.winSize.width / 2) {
            this.move(false, true);
        } else {
            this.move(true, false);
        }
    }

    /**
     * 
     * @description: 触碰屏幕结束回调事件
     */
    private onEndTouch() {
       this.move(false, false);
    }

    /**
     * @description: 按下键盘回调事件
     * @param event: 触发事件
     */
    private onKeyDown(event: cc.Event.EventKeyboard) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.move(true, false);
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.move(false, true);
                break;
        }
    }

    /**
     * @description: 松开键盘回调事件
     * @param event: 触发事件
     */
    private onKeyUp(event: cc.Event.EventKeyboard) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.move(false, false);
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.move(false, false);
                break;
        }
    }
}
