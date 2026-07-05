import getChatTypeByGuid from "../../utils/getChatType.js";
import isBot from "../../utils/isBot.js";
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
  get time() {
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
  get chatIsBot() {
    return isBot(this.context.chat_id);
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
  get isCommand() {
    return (
      this.context.new_message.text.startsWith("/") &&
      !this.context.new_message.text.includes(" ")
    );
  }
  get command() {
    if (this.isCommand) {
      return this.text.replace("/", "");
    }
  }
  get query() {
    return this.context.new_message.aux_data?.button_id;
  }
  get isQuery() {
    return !!this.context.new_message.aux_data;
  }
}

export default NewMessageContext;
