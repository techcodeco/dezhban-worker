class EditMessageContext {
  constructor(update) {
    this.context = update;
  }
  get text() {
    return this.context.updated_message.text;
  }
  get messageId() {
    return this.context.updated_message.message_id;
  }
  get replyTo() {
    return this.context.updated_message.reply_to_message_id;
  }
  get replyTo() {
    return this.context.updated_message.time;
  }
  get isEdited() {
    return this.context.updated_message.is_edited;
  }
  get senderType() {
    return this.context.updated_message.sender_type;
  }
  get senderId() {
    return this.context.updated_message.sender_id;
  }
  get chatId() {
    return this.context.chat_id;
  }
  get type() {
    return this.context.type;
  }
}

export default EditMessageContext;
