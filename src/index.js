import { redis } from "./config/redis.js";
import RubikaApi from "./core/RubikaApi.js";
import { handleMessage } from "./handler/handleMessage.js";
import dotenv from "dotenv";
dotenv.config();
const STREAM_NAME = "rubika:updates";
const CONSUMER_GROUP = "rubika-group";
const CONSUMER_NAME = `worker-${process.pid}`;
const TOKEN = process.env.RUBIKA_TOKEN;
const bot = new RubikaApi(TOKEN);
async function main() {
  console.log(`🚀 Worker ${CONSUMER_NAME} started`);

  try {
    await redis.ping();
    console.log("✅ Redis connected");
  } catch (error) {
    console.error("❌ Redis connection failed:", error);
    process.exit(1);
  }

  try {
    await redis.xgroup("CREATE", STREAM_NAME, CONSUMER_GROUP, "$", "MKSTREAM");
  } catch (e) {
    if (!e.message?.includes("BUSYGROUP")) {
      console.error("Group creation error:", e);
    }
  }

  while (true) {
    try {
      const results = await redis.xreadgroup(
        "GROUP",
        CONSUMER_GROUP,
        CONSUMER_NAME,
        "COUNT",
        10,
        "BLOCK",
        0,
        "STREAMS",
        STREAM_NAME,
        ">",
      );

      if (results) {
        for (const [, messages] of results) {
          await Promise.all(
            messages.map((message) =>
              handleMessage(bot, STREAM_NAME, CONSUMER_GROUP, message),
            ),
          );
        }
      }
    } catch (error) {
      console.error("❌ Error:", error);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}
bot.polling();
bot.on("newMessage", (u) => {
  console.log("recived update", u.query);
});

process.on("SIGINT", () => {
  redis.quit();
  process.exit(0);
});
process.on("SIGTERM", () => {
  redis.quit();
  process.exit(0);
});

main();
