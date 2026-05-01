const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
  tls: process.env.NODE_ENV !== "test" ? { rejectUnauthorized: false } : undefined,
  retryStrategy: (times) => {
    if (process.env.NODE_ENV === "test" && times > 3) return null;
    return Math.min(times * 200, 2000);
  },
});

redisClient.on("connect", () => console.log("Redis connected"));
redisClient.on("error", () => {});

module.exports = redisClient;
