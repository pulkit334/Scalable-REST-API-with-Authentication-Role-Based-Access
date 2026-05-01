const redisClient = require("../config/redis");

const cache = (duration) => {
  return async (req, res, next) => {
    if (req.method !== "GET") return next();

    const key = `product:${req.originalUrl}`;

    try {
      const cached = await redisClient.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      res.originalJson = res.json;
      res.json = (body) => {
        redisClient.set(key, JSON.stringify(body), "EX", duration);
        return res.originalJson(body);
      };
    } catch {
      // Redis unavailable, proceed without cache
    }

    next();
  };
};

module.exports = cache;
