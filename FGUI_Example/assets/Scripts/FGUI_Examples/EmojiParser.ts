export default class EmojiParser extends fgui.UBBParser {
    private static TAGS: Array<string> = ["1f600", "1f601", "1f602","1f603", "1f604", "1f605","1f606", "1f607", "1f608",
                                        "1f609", "1f610", "1f611","1f612", "1f613"];
    
    public constructor() {
        super();

        EmojiParser.TAGS.forEach(element => {
            this._handlers[":" + element] = this.onTag_Emoji;
        });
    }
    /**
     * @description: 富文本转换为表情
     * @param tagName：tag名字
     * @param end：是否结束
     * @param attr：属性
     */
    private onTag_Emoji(tagName: string, end: boolean, attr: string): string {
        return "<img src='" + fgui.UIPackage.getItemURL("Chat", tagName.substring(1).toLowerCase()) + "'/>";
    }
}