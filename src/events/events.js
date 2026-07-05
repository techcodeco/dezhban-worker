import privateChat from "../controllers/private/index.js";
import publicChat from "../controllers/public/index.js";

export const newMessage = async (bot, update) => {
  if (!update.chatIsUser && !update.chatIsBot) {
    await publicChat(bot, update);
    bot.cache.set(`${update.chatId}:${update.messageId}`, {
      text: update.text,
      senderId: update.senderId,
      senderType: update.senderType,
    });
  } else {
    await privateChat(bot, update);
  }
};
export const editMessage = async (bot, update) => {
  if (!update.chatIsUser) {
    bot.cache.set(`${update.chatId}:${update.mesageId}`, {
      text: update.text,
      senderId: update.senderId,
      senderType: update.senderType,
    });
  }
};
export const removeMessage = async (bot, update) => {
  if (!update.chatIsUser) {
    bot.cache.delete(`${update.chatId}:${update.removedMessageId}`);
  }
};
