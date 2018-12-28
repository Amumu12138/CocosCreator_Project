const {ccclass, property} = cc._decorator;
import JoystickModule from "./JoystickModule";

@ccclass
export default class JoystickExample extends cc.Component {
    @property(fgui.GComponent)
    private _view: fgui.GComponent = null;
    @property(fgui.GTextField)
    private _text: fgui.GTextField = null;
    @property(JoystickModule)
    private _joystick: JoystickModule = null;

    protected onLoad() {
        fgui.UIPackage.loadPackage("UI/Joystick", this.onUILoaded.bind(this));
    }
    /**
     * @description: 加载UI界面
     */
    public onUILoaded() {
        this._view = fgui.UIPackage.createObject("Joystick", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);

        this._text = this._view.getChild("degreeText").asTextField;
        this._joystick = new JoystickModule(this._view);
        this._joystick.on(JoystickModule.JoystickMoving, this.onJoystickMoving, this);
        this._joystick.on(JoystickModule.JoystickUp, this.onJoystickUp, this);

    }
    /**
     * @description:  虚拟摇杆移动
     * @param degree: 移动信息
     */
    private onJoystickMoving(degree: number): void {
        this._text.text = "" + degree;
    }
    /**
     * @description:  虚拟摇杆松开
     */
    private onJoystickUp(): void {
        this._text.text = "";
    }
}