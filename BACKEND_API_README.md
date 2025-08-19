# TASFA Backend API Documentation

## 🚀 **Overview**

This document provides comprehensive documentation for the TASFA (Theater Arts Students Festival Awards) backend API. The system handles participant management, voting, and real-time status updates.

## 📋 **Table of Contents**

1. [Authentication & Rate Limiting](#authentication--rate-limiting)
2. [API Endpoints](#api-endpoints)
3. [Data Models](#data-models)
4. [Error Handling](#error-handling)
5. [Caching Strategy](#caching-strategy)
6. [Implementation Guidelines](#implementation-guidelines)
7. [Troubleshooting](#troubleshooting)

---

## 🔐 **Authentication & Rate Limiting**

### Rate Limits

- **Voting Status Endpoint**: 500 requests per minute
- **Vote Submission**: 10 requests per minute per user
- **Participant Data**: 200 requests per minute
- **General Endpoints**: 100 requests per minute

### CORS Configuration

```javascript
app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-frontend-domain.com"],
    credentials: true,
  })
);
```

---

## 🛣️ **API Endpoints**

### 1. **Health Check**

```http
GET /health
```

**Response:**

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. **Get Participants by Category**

```http
GET /api/votes/category/:category
```

**Parameters:**

- `category` (string): Category name (e.g., "Best Actor", "Best Actress")

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "participant_id",
      "firstName": "John",
      "lastName": "Doe",
      "school": "University of Lagos",
      "awardCategory": "Best Actor",
      "voteCount": 150,
      "image": "https://example.com/image.jpg"
    }
  ]
}
```

**Implementation Notes:**

- Cache response for 10 minutes
- Return 429 if rate limit exceeded
- Include vote counts in real-time

### 3. **Submit Vote**

```http
POST /api/votes
```

**Request Body:**

```json
{
  "participantId": "participant_id",
  "category": "Best Actor"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "voteId": "vote_id",
    "participantId": "participant_id",
    "category": "Best Actor",
    "timestamp": "2024-01-15T10:30:00Z",
    "voteCount": 151
  }
}
```

**Implementation Notes:**

- Check 24-hour voting restriction
- Prevent duplicate votes per user per category
- Update participant vote count immediately
- Invalidate relevant caches

### 4. **Get Voting Status**

```http
GET /api/votes/voting-status
```

**Response:**

```json
{
  "success": true,
  "data": {
    "votedCategories": ["Best Actor"],
    "canVote": true,
    "voteTimestamps": {
      "Best Actor": "2024-01-15T10:30:00Z"
    },
    "nextVoteTimes": {
      "Best Actor": "2024-01-16T10:30:00Z"
    }
  }
}
```

**Implementation Notes:**

- Cache for 30 seconds
- Return server-side timestamps
- Calculate 24-hour restrictions
- High priority endpoint (increased rate limits)

### 5. **Get Voting History**

```http
GET /api/votes/voting-history
```

**Response:**

```json
{
  "success": true,
  "data": {
    "votedParticipants": [
      {
        "_id": "participant_id",
        "firstName": "John",
        "lastName": "Doe",
        "awardCategory": "Best Actor",
        "votedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

**Implementation Notes:**

- Cache for 1 minute
- Include participant details
- Sort by most recent vote

### 6. **Get Vote Counts**

```http
GET /api/votes/counts
```

**Response:**

```json
{
  "success": true,
  "data": {
    "Best Actor": 150,
    "Best Actress": 120,
    "Best Director": 80
  }
}
```

**Implementation Notes:**

- Cache for 10 seconds
- Real-time aggregation
- Include all categories

---

## 📊 **Data Models**

### Participant Schema

```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  school: String,
  awardCategory: String,
  voteCount: Number,
  image: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Vote Schema

```javascript
{
  _id: ObjectId,
  participantId: ObjectId,
  category: String,
  userId: String, // IP or session-based
  timestamp: Date,
  createdAt: Date
}
```

### Voting Status Schema

```javascript
{
  userId: String,
  votedCategories: [String],
  voteTimestamps: {
    [category]: Date
  },
  lastUpdated: Date
}
```

---

## ⚠️ **Error Handling**

### Standard Error Response

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Error Codes

- `RATE_LIMIT_EXCEEDED`: 429
- `VOTING_RESTRICTED`: 403
- `DUPLICATE_VOTE`: 409
- `INVALID_CATEGORY`: 400
- `PARTICIPANT_NOT_FOUND`: 404
- `SERVER_ERROR`: 500

### Rate Limit Response

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

---

## 🗄️ **Caching Strategy**

### Redis Cache Configuration

```javascript
const redis = require("redis");
const client = redis.createClient({
  url: process.env.REDIS_URL,
});

// Cache TTLs
const CACHE_TTL = {
  VOTING_STATUS: 30, // 30 seconds
  VOTE_COUNTS: 10, // 10 seconds
  PARTICIPANTS: 600, // 10 minutes
  VOTING_HISTORY: 60, // 1 minute
};
```

### Cache Keys

```javascript
const CACHE_KEYS = {
  VOTING_STATUS: (userId) => `voting_status:${userId}`,
  VOTE_COUNTS: (category) => `vote_counts:${category}`,
  PARTICIPANTS: (category) => `participants:${category}`,
  VOTING_HISTORY: (userId) => `voting_history:${userId}`,
};
```

### Cache Invalidation

```javascript
// Invalidate caches when vote is submitted
const invalidateCaches = async (category, userId) => {
  await Promise.all([
    client.del(CACHE_KEYS.VOTING_STATUS(userId)),
    client.del(CACHE_KEYS.VOTE_COUNTS(category)),
    client.del(CACHE_KEYS.PARTICIPANTS(category)),
  ]);
};
```

---

## 🛠️ **Implementation Guidelines**

### 1. **Database Queries**

#### Get Participants with Vote Counts

```javascript
const getParticipantsByCategory = async (category) => {
  return await Participant.aggregate([
    { $match: { awardCategory: category } },
    {
      $lookup: {
        from: "votes",
        localField: "_id",
        foreignField: "participantId",
        as: "votes",
      },
    },
    {
      $addFields: {
        voteCount: { $size: "$votes" },
      },
    },
    { $unset: "votes" },
    { $sort: { voteCount: -1 } },
  ]);
};
```

#### Check Voting Restriction

```javascript
const canVote = async (userId, category) => {
  const lastVote = await Vote.findOne({
    userId,
    category,
  }).sort({ timestamp: -1 });

  if (!lastVote) return true;

  const hoursSinceVote = (Date.now() - lastVote.timestamp) / (1000 * 60 * 60);
  return hoursSinceVote >= 24;
};
```

### 2. **Rate Limiting Implementation**

```javascript
const rateLimit = require("express-rate-limit");

const votingStatusLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 500, // 500 requests per minute
  message: {
    success: false,
    error: "Rate limit exceeded for voting status",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/votes/voting-status", votingStatusLimiter);
```

### 3. **Error Middleware**

```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Validation error",
      code: "VALIDATION_ERROR",
      details: err.message,
    });
  }

  if (err.name === "RateLimitExceeded") {
    return res.status(429).json({
      success: false,
      error: "Rate limit exceeded",
      code: "RATE_LIMIT_EXCEEDED",
      retryAfter: Math.ceil(err.resetTime / 1000),
    });
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
    code: "SERVER_ERROR",
  });
};
```

### 4. **Caching Middleware**

```javascript
const cacheMiddleware = (ttl) => {
  return async (req, res, next) => {
    const key = `${req.originalUrl}:${req.ip}`;

    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      res.originalJson = res.json;
      res.json = function (data) {
        client.setex(key, ttl, JSON.stringify(data));
        res.originalJson(data);
      };

      next();
    } catch (error) {
      next();
    }
  };
};
```

---

## 🔧 **Troubleshooting**

### Common Issues

#### 1. **429 Rate Limit Errors**

**Symptoms:** Frontend receives 429 errors frequently
**Solutions:**

- Increase rate limits for voting status endpoint
- Implement client-side caching
- Add exponential backoff retry logic

#### 2. **Data Inconsistency**

**Symptoms:** Vote counts don't match between endpoints
**Solutions:**

- Ensure all endpoints use same data source
- Implement cache invalidation on vote submission
- Add database transactions for vote operations

#### 3. **High Response Times**

**Symptoms:** API responses are slow
**Solutions:**

- Implement Redis caching
- Optimize database queries with indexes
- Use connection pooling

### Performance Monitoring

```javascript
// Add response time logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
    );
  });
  next();
});
```

### Database Indexes

```javascript
// Required indexes for optimal performance
db.votes.createIndex({ userId: 1, category: 1, timestamp: -1 });
db.votes.createIndex({ participantId: 1 });
db.participants.createIndex({ awardCategory: 1 });
db.votes.createIndex({ timestamp: -1 });
```

---

## 📝 **Environment Variables**

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/tasfa
REDIS_URL=redis://localhost:6379

# Server
PORT=3001
NODE_ENV=production

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=500

# Caching
CACHE_TTL_VOTING_STATUS=30
CACHE_TTL_VOTE_COUNTS=10
CACHE_TTL_PARTICIPANTS=600
```

---

## 🚀 **Deployment Checklist**

- [ ] Set up Redis for caching
- [ ] Configure rate limiting
- [ ] Set up database indexes
- [ ] Implement error monitoring
- [ ] Configure CORS properly
- [ ] Set up health check endpoint
- [ ] Test all endpoints with load testing
- [ ] Monitor response times and error rates

---

## 📞 **Support**

For technical support or questions about the API:

- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

---

_Last updated: January 2024_
