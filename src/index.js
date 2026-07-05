import { Redis } from "ioredis";
import MongoConnect from "./config/mongo.js";
import RubikaApi from "./core/RubikaApi.js";
import dotenv from "dotenv";
import RedisStream from "./config/redisStream.js";
import updateHandler from "./handlers/updateHandler.js";
import { editMessage, newMessage, removeMessage } from "./events/events.js";
dotenv.config();

const STREAM_NAME = "rubika:updates";
const CONSUMER_GROUP = "rubika-group";
const CONSUMER_NAME = `worker-${process.pid}`;
const TOKEN = process.env.RUBIKA_TOKEN;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV;
const REDIS_URI = process.env.REDIS_URI;

const bot = new RubikaApi(TOKEN);

let mongoConn = new MongoConnect(MONGO_URI);

mongoConn.on("connected", async (conn) => {
  console.log("mongo database is ready ✅");
  const redis = new Redis(REDIS_URI, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: (times) => {
      if (times > 10) return null;
      return Math.min(times * 100, 3000);
    },
  });
  redis.on("connect", () => {
    console.log("redis database is ready ✅");
    console.log(`🚀 Worker ${CONSUMER_NAME} started`);
    let redisStreamer = new RedisStream(
      redis,
      STREAM_NAME,
      CONSUMER_GROUP,
      CONSUMER_NAME,
    );
    redisStreamer.on("data", async ({ data, streamId }) => {
      updateHandler(bot, data);
      await redis.xack(STREAM_NAME, CONSUMER_GROUP, streamId);
    });
    redisStreamer.on("error", async () => {
      console.log(
        "redis streamer error try for create group :",
        CONSUMER_GROUP,
      );
      redisStreamer.createGroup();
    });
    bot.on("newMessage", (update) => newMessage(bot, update));
    bot.on("updateMessage", (update) => editMessage(bot, update));
    bot.on("removeMessage", (update) => removeMessage(bot, update));
    if (NODE_ENV == "dev") {
      bot.polling();
    }
  });
  redis.on("error", () => {
    console.log("redis is not ready error in connection");
    process.exit(1);
  });
});
mongoConn.on("error", () => {
  console.log("mongo is not ready error in connection");
  process.exit(1);
});
