const { Queue } = require("bullmq");
const redisConfig = require("./redis");

const productQueue = new Queue("product-jobs", {
  connection: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: { age: 3600 },
  },
});

module.exports = productQueue;
