import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URI, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy: (times) => {
    if (times > 10) return null;
    return Math.min(times * 100, 3000);
  },
});

redis.on("connect", () =>
  console.log("connection to redis database successed"),
);
redis.on("error", (err) => console.error("Redis error:", err));

export { redis };
