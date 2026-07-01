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
