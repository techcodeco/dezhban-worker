import getChatTypeByGuid from "../../utils/getChatType.js";
import isGroup from "../../utils/isGroup.js";
import isUser from "../../utils/isUser.js";

class NewMessageContext {
  constructor(update) {
    this.context = update;
  }
  get text() {
    return this.context.new_message.text;
  }
  get messageId() {
    return this.context.new_message.message_id;
  }
  get replyTo() {
    return this.context.new_message.reply_to_message_id;
  }
  get replyTo() {
    return this.context.new_message.time;
  }
  get isEdited() {
    return this.context.new_message.is_edited;
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
  get senderType() {
    return this.context.new_message.sender_type;
  }
  get senderId() {
    return this.context.new_message.sender_id;
  }
  get chatId() {
    return this.context.chat_id;
  }
  get type() {
    return this.context.type;
  }
}

export default NewMessageContext;
