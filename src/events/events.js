export const newMessage = async (bot, update) => {
  bot.cache.set(`${update.chatId}:${update.mesageId}`, {
    text: update.text,
    senderId: update.senderId,
    senderType: update.senderType,
  });
};
export const editMessage = async (bot, update) => {
  bot.cache.set(`${update.chatId}:${update.mesageId}`, {
    text: update.text,
    senderId: update.senderId,
    senderType: update.senderType,
  });
};
export const removeMessage = async (bot, update) => {
  bot.cache.delete(`${update.chatId}:${update.removedMessageId}`);
};
