import getChatTypeByGuid from "../../utils/getChatType.js";
import isGroup from "../../utils/isGroup.js";
import isUser from "../../utils/isUser.js";

class RemoveMessageContext {
  constructor(update) {
    this.context = update;
  }
  get chatType() {
    return getChatTypeByGuid(this.context.chat_id);
  }
  get chatIsUser() {
    return isUser(this.context.chat_id);
  }
  get chatIsGroup() {
    return isGroup(this.context.chat_id);
  }
  get chatId() {
    return this.context.chat_id;
  }
  get removedMessageId() {
    return this.context.removed_message_id;
  }
}

export default RemoveMessageContext;
