const express = require("express");
require("./config/redis"); // Initialize redis early
const rateLimiter = require("./middleware/ratelimiter");

const app = express();

// --- Example Rate Limiters ---
// Strict limiter for authentication routes
// Capacity 2, refills 0.1 tokens per second (1 token every 10 seconds)
const strictLimiter = rateLimiter({ capacity: 2, refillRate: 0.1 });

// Relaxed limiter for standard API routes
// Capacity 10, refills 1 token per second
const relaxedLimiter = rateLimiter({ capacity: 10, refillRate: 1 });

app.use(express.json());

// Apply strict limiter on login
app.post("/login", strictLimiter, (req, res) => {
  res.json({ message: "Login logic executed successfully." });
});

// Apply relaxed limiter on generic API endpoints
app.get("/api", relaxedLimiter, (req, res) => {
  res.json({ message: "API response successful." });
});

// Test route showing req.user support
app.get("/test-auth", (req, res, next) => {
  // Mocking an authenticated user
  req.user = { id: 12345 };
  next();
}, rateLimiter({ capacity: 5, refillRate: 0.5 }), (req, res) => {
  res.json({ message: "Authenticated request allowed." });
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});