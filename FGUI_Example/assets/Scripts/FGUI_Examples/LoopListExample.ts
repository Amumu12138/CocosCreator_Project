
const {ccclass, property} = cc._decorator;
@ccclass
export default class LoopListExample extends cc.Component {
    @property(fgui.GComponent)
    private _view: fgui.GComponent = null;
    @property(fgui.GList)
    private _list: fgui.GList = null;
    @property(fgui.GTextField)
    private _indexText: fgui.GTextField = null;

    protected onLoad() {
        fgui.UIPackage.loadPackage("UI/LoopList", this.onUILoaded.bind(this));
    }
    /**
     * @description: 加载UI界面
     */
    public onUILoaded() {
        this._view = fgui.UIPackage.createObject("LoopList", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);

        this._list = this._view.getChild("itemList").asList;
        this._list.setVirtualAndLoop();                                 //设置虚拟列表且循环
        this._list.itemRenderer = this.renderListItem.bind(this);
        this._list.numItems = 5;                                         //图标总数量
        this._list.on(fgui.Event.SCROLL, this.doSpecialEffect, this);

        this._indexText = this._view.getChild("n3").asTextField;
    }
    /**
     * @description: 绘制循环列表
     * @param index：列表下标
     * @param obj:   列表资源
     */
    public renderListItem(index: number, obj: fgui.GObject): void {
        var icon: fgui.GLoader = obj.asCom.getChild("n0").asLoader;
        icon.url = fgui.UIPackage.getItemURL("LoopList", "n" + (index + 1));
    }

    /**
     * @description: 将中间在滑动中图标自由缩放
     */
    public doSpecialEffect(): void {
        var midX: number = this._list._scrollPane.posX + this._list.viewWidth / 2;  //列表面板中心X
        var cnt: number = this._list.numChildren;                                   //显示在面板中的图表数量
        for (var i: number = 0; i < cnt; i++)
        {
            var obj: fgui.GObject = this._list.getChildAt(i);
            var dist: number = Math.abs(midX - obj.x - obj.width / 2)               //该图标中心到面板中心的距离
            if(dist > obj.width) 
            {
                obj.setScale(1,1);
            }
            else
            {
                var scale: number = 1 + (1 - dist / obj.width) * 0.2;               //随着距离的远近而缩放
                obj.setScale(scale, scale);
            }
        }
        
        this._indexText.text = "" + ((this._list.getFirstChildInView() + 1));       //显示列表下标文本
    }

}