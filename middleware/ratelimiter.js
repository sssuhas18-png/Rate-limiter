const redis = require("../config/redis");

const LUA_SCRIPT = `
  local key = KEYS[1]
  local capacity = tonumber(ARGV[1])
  local refillRate = tonumber(ARGV[2])
  local now = tonumber(ARGV[3])

  local tokensStr = redis.call('HGET', key, 'tokens')
  local lastRefillStr = redis.call('HGET', key, 'lastRefill')

  local tokens = capacity
  local lastRefill = now

  if tokensStr then
    tokens = tonumber(tokensStr)
    lastRefill = tonumber(lastRefillStr)
    
    local timePassed = math.max(0, now - lastRefill)
    tokens = math.min(capacity, tokens + (timePassed * refillRate))
  end

  if tokens < 1 then
    local retryAfter = math.ceil((1 - tokens) / refillRate)
    return { 0, tostring(tokens), retryAfter }
  end

  tokens = tokens - 1
  redis.call('HSET', key, 'tokens', tostring(tokens), 'lastRefill', tostring(now))
  
  local ttl = math.ceil((capacity - tokens) / refillRate)
  if ttl > 0 then
    redis.call('EXPIRE', key, ttl)
  end

  return { 1, tostring(tokens), 0 }
`;

/**
 * Rate Limiter Middleware Factory
 * @param {Object} options Options containing capacity and refillRate
 * @returns {Function} Express middleware function
 */
const rateLimiter = ({ capacity, refillRate }) => {
  return async (req, res, next) => {
    try {
      // Create user-specific or IP-specific rate limit key
    // req.user = { id: "user3" };
      const key = req.user && req.user.id 
        ? `rate:user:${req.user.id}` 
        : `rate:ip:${req.ip}`;
        
      const now = Date.now() / 1000; // time in seconds

      // Execute atomic Lua script
      const result = await redis.eval(
        LUA_SCRIPT,
        1,
        key,
        capacity,
        refillRate,
        now
      );

      const allowed = result[0] === 1;
      const tokensLeft = parseFloat(result[1]);
      const retryAfter = result[2];

      if (!allowed) {
        res.set("Retry-After", retryAfter);
        return res.status(429).json({
          message: "Too many requests. Try later.",
          retryAfter
        });
      }

      next();
    } catch (err) {
      // In a production environment, you might log this error 
      // and either fail open (allow req) or fail closed (deny req)
      next(err);
    }
  };
};

module.exports = rateLimiter;