const rateLimiter = require("./middleware/ratelimiter");
const redis = require("./config/redis");

async function test() {
  const req = { user: { id: "testuser" }, ip: "127.0.0.1" };
  const res = {
    set: (k, v) => console.log("Header " + k + ": " + v),
    status: (code) => {
      console.log("Status: " + code);
      return {
        json: (msg) => console.log("Blocked:", msg),
      };
    },
  };
  const next = (err) => {
    if (err) console.error("Error passed to next:", err);
    else console.log("Next called");
  };

  const limit = rateLimiter({ capacity: 2, refillRate: 0.1 });

  await limit(req, res, next);
  
  setTimeout(() => process.exit(0), 1000);
}

redis.on('connect', () => {
    test();
});
