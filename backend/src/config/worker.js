const { Worker } = require("bullmq");
const Product = require("../models/Product");
const redisClient = require("./redis");

const productWorker = new Worker(
  "product-jobs",
  async (job) => {
    const { action, productId, data } = job.data;

    if (action === "invalidate-cache") {
      const keys = await redisClient.keys(`product:*`);
      if (keys.length) await redisClient.del(...keys);
      console.log(`Cache invalidated for product operations`);
    }

    if (action === "notify-stock-low") {
      const product = await Product.findById(productId);
      if (product && product.stock < 5) {
        console.log(`Low stock alert: ${product.name} (${product.stock} remaining)`);
      }
    }

    return { success: true };
  },
  { connection: redisClient, concurrency: 5 }
);

productWorker.on("completed", (job) => console.log(`Job ${job.id} completed`));
productWorker.on("failed", (job, err) => console.error(`Job ${job.id} failed:`, err.message));

module.exports = productWorker;
