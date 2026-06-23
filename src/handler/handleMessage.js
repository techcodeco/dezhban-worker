import { redis } from "../config/redis.js";
let counter = 0;
export const handleMessage = async (bot, STREAM_NAME, CONSUMER_GROUP, msg) => {
  const [id, fields] = msg;
  try {
    if (fields[1]) return bot.updateHandler(JSON.parse(fields[1])?.update);
    return;
  } catch (error) {
    console.log(error.message, fields);
    throw error;
  }
  await redis.xack(STREAM_NAME, CONSUMER_GROUP, id);
};
