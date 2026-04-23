# 🚀 Rate Limiter System (Token Bucket + Redis + Lua)

A scalable and production-ready **Rate Limiting System** built using **Node.js, Redis, and Lua scripting**, implementing the **Token Bucket Algorithm** to control API traffic efficiently.

---

## 📌 Problem Statement

In real-world systems, APIs are vulnerable to:

* 🚫 Abuse (login brute force)
* 🚫 Spam requests
* 🚫 Server overload

This project solves that by:
👉 Controlling request flow
👉 Ensuring fair usage
👉 Protecting backend systems

---

## ⚙️ How It Works (Flow)

Request → Middleware → Unique Key → Redis → Token Refill → Limit Check → Response

1. Each request hits the **rate limiter middleware**
2. A unique key (IP/User) is generated
3. Redis stores token state
4. Tokens refill over time (based on rate)
5. If tokens available → request allowed ✅
6. If no tokens → request blocked ❌

---

## 🧠 Core Concept: Token Bucket Algorithm

* Bucket has fixed capacity (max tokens)
* Tokens refill over time
* Each request consumes 1 token

✔ Smooth traffic handling
✔ Allows burst requests
✔ Prevents sudden overload

---

## ⚡ Why Redis?

* Fast (in-memory)
* Shared across multiple servers
* Persistent and scalable

👉 Without Redis:

* Rate limiting breaks in distributed systems

---

## 🔒 Why Lua Script?

### ❌ Problem without Lua:

* Multiple requests → race condition
* Inconsistent token updates

### ✅ Solution:

* Lua executes atomically inside Redis

👉 Ensures:

* No data race
* Accurate token handling

---

## 🏗️ Project Structure

```
rate-limiter/
│── config/
│   └── redis.js
│── middleware/
│   └── ratelimiter.js
│── routes/
│── app.js
│── package.json
```

---

## 🛠 Tech Stack

* Node.js
* Express.js
* Redis
* Lua (for atomic operations)

---

## 🚀 Setup

```bash
npm install
node app.js
```

Make sure Redis is running locally:

```bash
redis-server
```

---

## 📡 Example Endpoints

* `/login` → strict limiter
* `/api` → relaxed limiter
* `/test-auth` → user-based limiter

---

## ⚠️ Edge Cases Handled

* Concurrent requests
* Token overflow protection
* Rate refill accuracy
* Redis TTL management

---

## ⚖️ Trade-offs

| Approach       | Pros                   | Cons              |
| -------------- | ---------------------- | ----------------- |
| Token Bucket   | Smooth + burst support | Slight complexity |
| Fixed Window   | Simple                 | Burst issues      |
| Sliding Window | Accurate               | More costly       |

---

## 🎯 Features

✔ Token Bucket Algorithm
✔ Redis-based distributed limiter
✔ Lua for atomic execution
✔ Middleware integration
✔ Configurable capacity & refill rate

---

## 💡 Future Improvements

* Retry mechanism
* Dynamic rate limits per user
* Dashboard for monitoring
* Distributed scaling

---

## 🧑‍💻 Author

**Suhas**
Backend Developer | Node.js | System Design Enthusiast

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
