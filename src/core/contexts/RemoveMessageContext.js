class RemoveMessageContext {
  constructor(update) {
    this.context = update;
  }
  get chatId() {
    return this.context.chat_id;
  }
  get removedMessageId() {
    return this.context.removed_message_id;
  }
}

export default RemoveMessageContext;
