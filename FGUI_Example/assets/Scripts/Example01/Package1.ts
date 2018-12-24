
const { ccclass, property } = cc._decorator;

@ccclass
export default class Package1 extends cc.Component {
    private _view: fgui.GComponent;

    protected onLoad() {
        //加载Package1包
        fgui.UIPackage.loadPackage("UI/Package1", this.onUILoaded.bind(this));
    }

    public onUILoaded() {
        //创建Package1包中的Component1组件
        this._view = fgui.UIPackage.createObject("Package1", "Component1").asCom;
        //填充场景
        this._view.makeFullScreen();
        //添加到Fgui根目录下
        fgui.GRoot.inst.addChild(this._view);
    }

    protected onDestroy() {
        fgui.UIPackage.removePackage("Package1");
    }
}
    
