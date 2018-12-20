
const { ccclass, property } = cc._decorator;

@ccclass
export default class Package1 extends cc.Component {
    private _view: fgui.GComponent;

    onLoad() {
        fgui.UIPackage.loadPackage("UI/Package1", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this._view = fgui.UIPackage.createObject("Package1", "Component1").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);
    }

    onDestroy() {
        fgui.UIPackage.removePackage("Package1");
    }
}
    
