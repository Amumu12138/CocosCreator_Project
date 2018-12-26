import EmojiParser from "./EmojiParser";
const {ccclass, property} = cc._decorator;
//消息结构体
class Message {
    public sender: string;
    public senderIcon: string;
    public msg: string;
    public fromMe: boolean;
}

@ccclass
export default class ChatExample extends cc.Component {
    @property(fgui.GComponent)
    private _view: fgui.GComponent = null;
    @property(fgui.GList)
    private _list: fgui.GList = null;
    @property(fgui.GTextField)
    private _input: fgui.GTextField = null;
    @property(fgui.GComponent)
    private _emojiSelectUI: fgui.GComponent = null; 
    @property(EmojiParser)
    private _emojiParser: EmojiParser = null;
    // @property(Array<Message>)
    private _messages: Array<Message> = null;

    protected onLoad() {
        fgui.UIPackage.loadPackage("UI/Chat", this.onUILoaded.bind(this));
    }
    /**
     * @description: 加载UI界面
     */
    public onUILoaded() {
        this._view = fgui.UIPackage.createObject("Chat", "Main").asCom;
        this._view.makeFullScreen();
        fgui.GRoot.inst.addChild(this._view);

        this._messages = new Array<Message>();
        this._emojiParser = new EmojiParser();

        this._list = this._view.getChild("msgList").asList;
        this._list.setVirtual();
        // this._list.itemProvider = this.getListItemResources.bind(this);
        this._list.itemRenderer = this.renderListItem.bind(this);

        this._input = this._view.getChild("input").asTextField;
        this._input.on(fgui.Event.Submit, this.onSubmit, this);

        this._view.getChild("sendBtn").onClick(this.onClickSendBtn, this);
        this._view.getChild("emojiBtn").onClick(this.onClickEmojiBtn, this);

        this._emojiSelectUI = fgui.UIPackage.createObject("Chat", "EmojiSelectUI").asCom;
        this._emojiSelectUI.getChild("emojiList").on(fgui.Event.CLICK_ITEM, this.onClickEmoji, this);
    }
    /**
     * @description:        添加信息
     * @param sender:       发送消息者
     * @param senderIcon:   发送者图标
     * @param msg:          消息内容
     * @param fromMe:       发送者是否自己
     */
    private addMsg(sender: string, senderIcon: string, msg: string, fromMe: boolean) {
        let isScrollBttom: boolean = this._list.scrollPane.isBottomMost;    //是否在最底部

        let newMessage = new Message();
        newMessage.sender = sender;
        newMessage.senderIcon = senderIcon;
        newMessage.msg = msg;
        newMessage.fromMe = fromMe;
        this._messages.push(newMessage);

        if(newMessage.fromMe) {
            if(this._messages.length == 1 || Math.random() < 0.7) {
                let replyMessage = new Message();
                replyMessage.sender = "FairyGUI";
                replyMessage.senderIcon = "r1";
                replyMessage.msg = "This is FairyGUI. [:1f600]";
                replyMessage.fromMe = false;
                this._messages.push(replyMessage);
            }
        }

        if (this._messages.length > 100)
            this._messages.splice(0, this._messages.length - 100);
        
        this._list.numItems = this._messages.length;

        if(isScrollBttom)
            this._list.scrollPane.scrollBottom();
    }

    /**
     * @description: 绘制消息列表
     * @param index：列表下标
     * @param item： 列表资源
     */
    private renderListItem(index: number, item: fgui.GButton):void {
        let msg = this._messages[index];
        if(msg.fromMe)
        {
            item.getChild("fromMe").visible = true;
            item.getChild("other").visible = false;
            item.getChild("myName").text = msg.sender;
            item.getChild("myIcon").asLoader.url = fgui.UIPackage.getItemURL("Chat", msg.senderIcon);
            item.getChild("myMsg").text = this._emojiParser.parse(msg.msg);
            return;
        }
        item.getChild("fromMe").visible = false;
        item.getChild("other").visible = true;
        item.getChild("otherName").text = msg.sender;
        item.getChild("otherIcon").asLoader.url = fgui.UIPackage.getItemURL("Chat", msg.senderIcon);
        item.getChild("otherMsg").text = this._emojiParser.parse(msg.msg);
    }
    /**
     * @description: 点击Send按钮发送消息
     */
    private onClickSendBtn() {
        let msg = this._input.text;
        if(!msg) return;

        this.addMsg("Creator", "r0", msg, true);
        this._input.text = "";
    }
    /**
     * @description:点击表情按钮，显示表情弹框
     * @param evt： 点击信息
     */
    private onClickEmojiBtn(evt: fgui.Event) {
        fgui.GRoot.inst.showPopup(this._emojiSelectUI, fgui.GObject.cast(evt.currentTarget), false);
    }
    /**
     * @description: 选中表情添加到文本框
     * @param item： 选中表情
     */
    private onClickEmoji(item: fgui.GObject) {
        this._input.text += "[:"+ item.text + "]";
    }

    /**
     * @description: 按回车键发送
     */
    private onSubmit() {
        this.onClickSendBtn();
    }

}