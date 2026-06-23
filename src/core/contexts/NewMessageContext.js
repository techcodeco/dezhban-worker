class newMessageContext {
  constructor(update) {
    this.update = update;
  }
  get text() {
    return this.update.new_message.text;
  }
  get messageId() {
    return this.update.new_message.message_id;
  }
  get replyTo() {
    return this.update.new_message.reply_to_message_id;
  }
  get replyTo() {
    return this.update.new_message.time;
  }
  get isEdited() {
    return this.update.new_message.is_edited;
  }
  get senderType() {
    return this.update.new_message.sender_type;
  }
  get senderId() {
    return this.update.new_message.sender_id;
  }
  get chatId() {
    return this.update.chat_id;
  }
  get type() {
    return this.update.type;
  }
}

export default newMessageContext;
