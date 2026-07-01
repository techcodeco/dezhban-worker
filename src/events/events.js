export const newMessage = async (bot, update) => {
  console.log(update.text);
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
  bot.cache.delete(`${update.chat_id}:${update.update.removed_message_id}`);
};
