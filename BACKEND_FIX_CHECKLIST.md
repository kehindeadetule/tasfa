# Backend Voting System Fix Checklist

## 🔍 **Root Cause Analysis**

Based on the frontend debugging, the backend has these issues:

- **429 Rate Limiting**: Too many requests to `/api/votes/voting-status`
- **429 Rate Limiting**: Too many requests to `/api/votes`
- **Data Inconsistency**: Voting status and voting history returning conflicting data
- **Cache Issues**: Stale data being returned

## 🛠️ **Backend Fix Checklist**

### **1. Rate Limiting Issues**

- [ ] **Increase rate limits** for voting status endpoint
  ```javascript
  // Current: 200 requests per 15 minutes
  // Suggested: 500 requests per 1 minute for voting status
  ```
- [ ] **Implement caching** on backend for voting status
  ```javascript
  // Cache voting status for 30 seconds
  // Cache vote counts for 10 seconds
  ```
- [ ] **Add special handling** for voting status endpoint
  ```javascript
  // Higher priority for voting status requests
  // Separate rate limit bucket
  ```

### **2. Data Consistency Issues**

- [ ] **Fix voting status endpoint** (`/api/votes/voting-status`)
  ```javascript
  // Ensure it returns accurate data
  // Check database queries
  // Verify timestamp calculations
  ```
- [ ] **Fix voting history endpoint** (`/api/votes/voting-history`)
  ```javascript
  // Ensure consistency with voting status
  // Check participant ID mapping
  ```
- [ ] **Synchronize data** between endpoints
  ```javascript
  // Both endpoints should use same data source
  // Same timestamp calculations
  ```

### **3. Database Issues**

- [ ] **Check vote timestamps** in database
  ```sql
  -- Verify vote timestamps are correct
  SELECT * FROM votes WHERE category = 'Best Actor' ORDER BY timestamp DESC;
  ```
- [ ] **Check for duplicate votes**
  ```sql
  -- Ensure no duplicate votes per user per category
  SELECT user_id, category, COUNT(*) FROM votes
  GROUP BY user_id, category HAVING COUNT(*) > 1;
  ```
- [ ] **Verify 24-hour calculation**
  ```sql
  -- Check if 24-hour logic is working correctly
  SELECT *,
         TIMESTAMPDIFF(HOUR, timestamp, NOW()) as hours_since_vote
  FROM votes WHERE category = 'Best Actor';
  ```

### **4. API Endpoint Fixes**

- [ ] **Voting Status Endpoint** (`/api/votes/voting-status`)
  ```javascript
  // Should return:
  {
    success: true,
    data: {
      votedCategories: ["Best Actor"], // Categories user voted for
      canVote: true, // Overall voting permission
      voteTimestamps: {
        "Best Actor": "2024-01-15T10:30:00Z" // When user voted
      }
    }
  }
  ```
- [ ] **Voting History Endpoint** (`/api/votes/voting-history`)
  ```javascript
  // Should return:
  {
    success: true,
    data: {
      votedParticipants: [
        {
          _id: "participant_id",
          awardCategory: "Best Actor",
          votedAt: "2024-01-15T10:30:00Z"
        }
      ]
    }
  }
  ```

### **5. Caching Implementation**

- [ ] **Add Redis caching** for voting data
  ```javascript
  // Cache voting status for 30 seconds
  const cacheKey = `voting_status_${userId}`;
  await redis.setex(cacheKey, 30, JSON.stringify(votingData));
  ```
- [ ] **Cache vote counts** for 10 seconds
  ```javascript
  // Cache participant vote counts
  const cacheKey = `vote_counts_${category}`;
  await redis.setex(cacheKey, 10, JSON.stringify(voteCounts));
  ```
- [ ] **Cache invalidation** on vote submission
  ```javascript
  // Clear relevant caches when vote is cast
  await redis.del(`voting_status_${userId}`);
  await redis.del(`vote_counts_${category}`);
  ```

### **6. Error Handling**

- [ ] **Add proper error responses**
  ```javascript
  // Instead of 429, return cached data if available
  if (rateLimited) {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
  }
  ```
- [ ] **Graceful degradation**
  ```javascript
  // Return partial data if some queries fail
  // Log errors for debugging
  ```

### **7. Performance Optimization**

- [ ] **Optimize database queries**
  ```javascript
  // Use indexes on frequently queried fields
  // Add composite indexes for user + category queries
  ```
- [ ] **Batch requests** where possible
  ```javascript
  // Combine voting status and history in single request
  // Reduce number of API calls
  ```
- [ ] **Add database connection pooling**
  ```javascript
  // Optimize database connections
  // Reduce connection overhead
  ```

### **8. Monitoring & Logging**

- [ ] **Add request logging**
  ```javascript
  // Log all voting-related requests
  // Track response times
  // Monitor error rates
  ```
- [ ] **Add performance metrics**
  ```javascript
  // Track cache hit rates
  // Monitor database query performance
  // Alert on high error rates
  ```

### **9. Testing**

- [ ] **Test rate limiting**
  ```javascript
  // Verify rate limits work correctly
  // Test with multiple concurrent users
  ```
- [ ] **Test data consistency**
  ```javascript
  // Verify voting status and history match
  // Test 24-hour restriction logic
  ```
- [ ] **Load testing**
  ```javascript
  // Test with high traffic
  // Verify caching works under load
  ```

### **10. Deployment**

- [ ] **Update environment variables**
  ```javascript
  // Set appropriate rate limits
  // Configure cache settings
  // Set database connection limits
  ```
- [ ] **Monitor after deployment**
  ```javascript
  // Watch for 429 errors
  // Monitor response times
  // Check data consistency
  ```

## 🎯 **Priority Order**

1. **High Priority**: Rate limiting and caching
2. **Medium Priority**: Data consistency fixes
3. **Low Priority**: Performance optimization

## ✅ **Success Criteria**

- [ ] No more 429 errors on voting status endpoint
- [ ] Voting status and history return consistent data
- [ ] 24-hour restriction works correctly
- [ ] Vote buttons show correct states
- [ ] Response times under 500ms

## 🔧 **Current Frontend Workaround**

The frontend has been updated with a workaround that handles backend inconsistencies:

```javascript
// Backend workaround: If user has voted, they can't vote again regardless of server status
const actualCanVote = canVote && votedParticipantId === null;
```

This ensures the voting system works correctly even when the backend has data inconsistencies.

## 📋 **Testing Checklist**

### **Before Deployment**

- [ ] Test rate limiting with multiple users
- [ ] Verify 24-hour restriction logic
- [ ] Check data consistency between endpoints
- [ ] Load test with high traffic

### **After Deployment**

- [ ] Monitor 429 error rates
- [ ] Check response times
- [ ] Verify vote button states
- [ ] Test voting functionality

## 🚨 **Emergency Rollback Plan**

If issues persist after deployment:

1. **Revert to previous version**
2. **Enable frontend workaround**
3. **Monitor error logs**
4. **Debug backend issues**

---

**Note**: The frontend workaround will handle inconsistencies until the backend is fixed, but the backend should be prioritized to ensure a robust voting system.
