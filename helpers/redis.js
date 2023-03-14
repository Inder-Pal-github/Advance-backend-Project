const redis = require("redis");

const redisClient = redis.createClient();

// {
//     host: "redis-17654.c301.ap-south-1-1.ec2.cloud.redislabs.com",
//     port: 17654,
//     username: "default",
//     password: "JtvQJyIT6FgKsNj5JAmpKxh5m6dQHOc1",
//   }
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", function (err) {
  console.log(err.message);
})

redisClient.connect();

module.exports = { redisClient };
