import  Package1  from "./Package1";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Example01 extends cc.Component {

    start () {
        fgui.addLoadHandler();
        fgui.GRoot.create();

        var demo = this.addComponent(Package1);
        this.node.emit("start_demo", demo);
        // this.destroy();
    }
}