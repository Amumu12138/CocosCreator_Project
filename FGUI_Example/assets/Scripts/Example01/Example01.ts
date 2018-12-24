import  Package1  from "./Package1";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Example01 extends cc.Component {

    protected start () {
        fgui.addLoadHandler();
        fgui.GRoot.create();
        //添加Package1组件
        this.addComponent(Package1);
        // var demo = this.addComponent(Package1);
        // this.node.emit("start_demo", demo);
        // this.destroy();
    }
}