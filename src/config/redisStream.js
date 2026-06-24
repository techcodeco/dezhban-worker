import { EventEmitter } from "events";

class RedisStream extends EventEmitter {
  constructor(redis, streamName, consumerGroup, consumerName) {
    super();
    this.redis = redis;
    this.STREAM_NAME = streamName;
    this.CONSUMER_GROUP = consumerGroup;
    this.CONSUMER_NAME = consumerName;
    this.createGroup();
  }
  async createGroup() {
    try {
      await this.redis.xgroup(
        "CREATE",
        this.STREAM_NAME,
        this.CONSUMER_GROUP,
        "$",
        "MKSTREAM",
      );
    } catch (e) {
      if (!e.message?.includes("BUSYGROUP")) {
        console.error("Group creation error:", e);
      }
      await this.streamer();
    }
  }
  async streamer() {
    while (true) {
      try {
        const results = await this.redis.xreadgroup(
          "GROUP",
          this.CONSUMER_GROUP,
          this.CONSUMER_NAME,
          "COUNT",
          10,
          "BLOCK",
          0,
          "STREAMS",
          this.STREAM_NAME,
          ">",
        );
        if (results) {
          for (const [, messages] of results) {
            await Promise.all(
              messages.map(async (message) => {
                try {
                  const [id, fields] = message;
                  if (fields[1])
                    return this.emit("data", JSON.parse(fields[1])?.update);
                } catch (error) {
                  this.emit("error", error);
                }
              }),
            );
          }
        }
      } catch (error) {
        this.emit("error", error);
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
}

export default RedisStream;
