
const {ccclass, property} = cc._decorator;
import BagExample from "./BagExample";

@ccclass
export default class MainMenu extends cc.Component {
    @property(fgui.GComponent)
    private _view: fgui.GComponent = null;

    protected onLoad() {
        fgui.UIPackage.loadPackage("UI/MainMenu", this.onUILoaded.bind(this));
        fgui.UIPackage.loadPackage("UI/Package1", this.onUILoaded.bind(this));
    }
    /**
     * 加载FGUI的UI界面
     */
    public onUILoaded() {
        fgui.UIPackage.addPackage("UI/MainMenu");

        this._view = fgui.UIPackage.createObject("MainMenu", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);

        this._view.getChild("bagBtn").onClick(function() {
            this.startExample(BagExample);
        }, this);
    }
    /**
     * @description: 加载点击界面
     * @param exampleClass 相对应的界面类
     */
    public startExample(exampleClass: typeof cc.Component) {
        let example: cc.Component = this.addComponent(exampleClass);
        this.node.emit("start_example", example);
        this.destroy();
    }

    protected onDestroy() {
        this._view.dispose();
    }
}