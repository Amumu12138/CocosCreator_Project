export default class JoystickModule extends cc.EventTarget {
    private _initX: number;
    private _initY: number;         //初始化坐标
    private _startStageX: number;
    private _startStageY: number;   //开始坐标
    private _lastStageX: number;
    private _lastStageY: number;    //结束坐标

    private _joystickButton: fgui.GButton;      //移动虚拟按钮
    private _thumb: fgui.GObject;               //移动按钮图标
    private _joystickCenter: fgui.GObject;      //虚拟操纵杆中心
    private _joystickTouch: fgui.GObject;       //虚拟操纵杆区域

    private _touchId: number;                   //Touch触摸ID
    private _tweener: fgui.GTweener;            //平滑缓动
    private _curPos: cc.Vec2;                   //当前位置

    public static JoystickMoving: string = "JoystickMoving";
    public static JoystickUp: string = "JoystickUp";
    public radius: number;

    public constructor(mainView: fgui.GComponent) {
        super();

        this._joystickButton = mainView.getChild("joystick").asButton;
        this._thumb = this._joystickButton.getChild("thumb");
        this._joystickCenter = mainView.getChild("joystick_center");
        this._joystickTouch = mainView.getChild("joystick_touch");

        this._initX = this._joystickCenter.x + this._joystickCenter.width / 2;
        this._initY = this._joystickCenter.y + this._joystickCenter.height / 2;
        this._touchId = -1;
        this.radius = 150;
        this._curPos = new cc.Vec2();

        this._joystickTouch.on(fgui.Event.TOUCH_BEGIN, this.onTouchDown, this);
        this._joystickTouch.on(fgui.Event.TOUCH_MOVE, this.onTouchMove, this);
        this._joystickTouch.on(fgui.Event.TOUCH_END, this.onTouchEnd, this);
    }
    /**
     * @description: 触发器
     */
    public trigger(evt: fgui.Event): void {
        this.onTouchDown(evt);
    }
    /**
     * @description: 触碰开始回调事件
     * @param evt:   触碰信息
     */
    public onTouchDown(evt: fgui.Event): void {
        if (this._touchId == -1) {//First touch
            this._touchId = evt.touchId;

            if (this._tweener != null) {
                this._tweener.kill();
                this._tweener = null;
            }

            fgui.GRoot.inst.globalToLocal(evt.pos.x, evt.pos.y, this._curPos);
            cc.log("evt.pos:" +　evt.pos);
            cc.log("curPos:" + this._curPos);
            var bx: number = this._curPos.x;
            var by: number = this._curPos.y;
            this._joystickButton.selected = true;

            if (bx < 0)
                bx = 0;
            else if (bx > this._joystickTouch.width)
                bx = this._joystickTouch.width;

            if (by > fgui.GRoot.inst.height)
                by = fgui.GRoot.inst.height;
            else if (by < this._joystickTouch.y)
                by = this._joystickTouch.y;
            // if (by < 0)
            //     by = 0;
            // else if (by > this._joystickTouch.height)
            //     by = this._joystickTouch.height;

            this._lastStageX = bx;
            this._lastStageY = by;
            this._startStageX = bx;
            this._startStageY = by;

            this._joystickCenter.visible = true;
            // this._joystickCenter.x = bx - this._joystickCenter.width / 2;
            // this._joystickCenter.y = by - this._joystickCenter.height / 2;
            // cc.log(this._joystickCenter.width)
            // cc.log(this._joystickCenter.x , this._joystickCenter.y)
            this._joystickButton.x = bx - this._joystickButton.width / 2;
            this._joystickButton.y = by - this._joystickButton.height / 2;
            // cc.log(this._initX, this._initY)
            // cc.log(this._joystickButton.x, this._joystickButton.y)

            var deltaX: number = bx - this._initX;
            var deltaY: number = by - this._initY;
            var degrees: number = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
            this._thumb.rotation = degrees + 90;

            evt.captureTouch();
        }
    }
    /**
     * @description: 触碰移动回调事件
     * @param evt:   触碰信息
     */
    public onTouchMove(evt: fgui.Event): void {
        if (this._touchId != -1 && evt.touchId == this._touchId) {
            var bx: number = evt.pos.x;
            var by: number = evt.pos.y;
            var moveX: number = bx - this._lastStageX;
            var moveY: number = by - this._lastStageY;
            this._lastStageX = bx;
            this._lastStageY = by;
            var buttonX: number = this._joystickButton.x + moveX;
            var buttonY: number = this._joystickButton.y + moveY;

            var offsetX: number = buttonX + this._joystickButton.width / 2 - this._startStageX;
            var offsetY: number = buttonY + this._joystickButton.height / 2 - this._startStageY;

            var rad: number = Math.atan2(offsetY, offsetX);
            var degree: number = rad * 180 / Math.PI;
            this._thumb.rotation = degree + 90;

            var maxX: number = this.radius * Math.cos(rad);
            var maxY: number = this.radius * Math.sin(rad);
            if (Math.abs(offsetX) > Math.abs(maxX))
                offsetX = maxX;
            if (Math.abs(offsetY) > Math.abs(maxY))
                offsetY = maxY;

            buttonX = this._startStageX + offsetX;
            buttonY = this._startStageY + offsetY;
            if (buttonX < 0)
                buttonX = 0;
            if (buttonY > fgui.GRoot.inst.height)
                buttonY = fgui.GRoot.inst.height;

            this._joystickButton.x = buttonX - this._joystickButton.width / 2;
            this._joystickButton.y = buttonY - this._joystickButton.height / 2;

            this.emit(JoystickModule.JoystickMoving, degree);
        }
    }
    /**
     * @description: 触碰结束回调事件
     * @param evt:   触碰信息
     */
    public onTouchEnd(evt: fgui.Event): void {
        if (this._touchId != -1 && evt.touchId == this._touchId) {
            this._touchId = -1;
            this._thumb.rotation = this._thumb.rotation + 180;
            // this._joystickCenter.visible = false;
            this._joystickCenter.visible = true;
            this._tweener = fgui.GTween.to2(this._joystickButton.x, this._joystickButton.y, this._initX - this._joystickButton.width / 2, this._initY - this._joystickButton.height / 2, 0.3)
                .setTarget(this._joystickButton, this._joystickButton.setPosition)
                .setEase(fgui.EaseType.CircOut)
                .onComplete(this.onTweenComplete, this);

            this.emit(JoystickModule.JoystickUp);
        }
    }
    /**
     * @description: 操纵按钮缓动回到中心区域
     */
    private onTweenComplete(): void {
        this._tweener = null;
        this._joystickButton.selected = false;
        this._thumb.rotation = 0;
        this._joystickCenter.visible = true;
        // this._joystickCenter.x = this._initX - this._joystickCenter.width / 2;
        // this._joystickCenter.y = this._initY - this._joystickCenter.height / 2;
    }
}