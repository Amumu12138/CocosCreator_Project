import MainMenu from "./MainMenu";

const {ccclass, property} = cc._decorator;
@ccclass
export default class DemoEntry extends cc.Component {
    @property(fgui.GObject)
    private _closeButton: fgui.GObject = null;
    @property(cc.Component)
    private _currentExample: cc.Component = null;

    protected onLoad() {
        fgui.addLoadHandler();
        fgui.GRoot.create();

        this.node.on("start_example", this.onExampleStart, this);
        this.addComponent(MainMenu);
    }
    /**
     * @description: 添加主界面MainMenu
     * @param example 示例类
     */
    public onExampleStart(example: cc.Component) {
        this._currentExample = example;
        this._closeButton = fgui.UIPackage.createObject("MainMenu", "CloseButton");
        this._closeButton.setPosition(fgui.GRoot.inst.width - this._closeButton.width - 10, 10);
        //设置组件跟容器关联对齐
        this._closeButton.addRelation(fgui.GRoot.inst, fgui.RelationType.Right_Right);
        this._closeButton.addRelation(fgui.GRoot.inst, fgui.RelationType.Top_Top);
        //设置组件层级
        this._closeButton.sortingOrder = 100000;
        this._closeButton.onClick(this.onExampleClose, this);
        fgui.GRoot.inst.addChild(this._closeButton);
        
    }
    /**
     * @description: 单击按钮关闭界面
     */
    public onExampleClose() {
        fgui.GRoot.inst.removeChildren(0, -1 ,true);
        this.node.removeComponent(this._currentExample);
        this.addComponent(MainMenu);
    }
}