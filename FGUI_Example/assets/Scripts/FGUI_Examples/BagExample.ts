
const {ccclass, property} = cc._decorator;

@ccclass
export default class BagExample extends cc.Component {
    @property(fgui.GComponent)
    private _view: fgui.GComponent = null;
    @property(fgui.Window)
    private _bagWindow: fgui.Window = null;

    protected onLoad() {
        fgui.UIPackage.loadPackage("UI/Bag", this.onUILoaded.bind(this));
    }

    public onUILoaded() {
        this._view = fgui.UIPackage.createObject("Bag", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);

        this._bagWindow = new BagWindow();
        this._view.getChild("n0").onClick(() => { this._bagWindow.show(); }, this);
    }

    protected onDestroy() {
        fgui.UIPackage.removePackage("Bag");
    }

}
// BagWindos类
class BagWindow extends fgui.Window {
    public constructor() {
        super();
    }

    /**
     * @description: 初始化
     */
    protected onInit() {
        this.contentPane = fgui.UIPackage.createObject("Bag", "BagWin").asCom;
        this.center();
    }

    /**
     * @description: 显示界面
     */
    protected onShown() {
        //物品显示界面
        let frame = this.contentPane.getChild("frame").asCom;
        //点击关闭按钮隐藏界面
        frame.getChild("n3").onClick(() => { this.hide(); }, this);

        let list: fgui.GList = this.contentPane.getChild("list").asList;
        list.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);
        list.itemRenderer = this.renderListItem.bind(this);
        list.setVirtual();
        list.numItems = 40;
    }
    /**
     * @description：绘制物品列表
     * @param index: 下标
     * @param obj: 物品组件
     */
    private renderListItem(index: number, obj: fgui.GObject) {
        obj.icon = "Icons/i" + Math.floor(Math.random() * 10);
        obj.text = "" + Math.floor(Math.random() * 50);
    }
    /**
     * @description: 点击物品事件
     * @param item 子物品
     */
    private onClickItem(item: fgui.GObject) {
        this.contentPane.getChild("n7").asLoader.url = item.icon;
        this.contentPane.getChild("n9").text = item.icon;
    }
}