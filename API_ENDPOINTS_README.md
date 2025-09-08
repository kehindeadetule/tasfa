# 📋 TASFA API Endpoints Documentation

## Overview

This document provides a comprehensive list of all API endpoints currently in use in the TASFA voting application, including their usage patterns, request/response data structures, and implementation details.

## 🔧 Base Configuration

**Base URL**: `https://tasfa-be.onrender.com` (or `NEXT_PUBLIC_API_BASE_URL`)

**Environment Variables**:

```bash
NEXT_PUBLIC_API_BASE_URL=https://tasfa-be.onrender.com
NEXT_PUBLIC_ENV=production
```

---

## 🔐 Authentication Endpoints (Email-based)

### 1. **POST** `/api/email-auth/signup/request-otp`

**Purpose**: Request OTP for new account registration

**Request Data**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Data**:

```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

**Usage Location**: `src/components/auth/UnifiedAuthForm.tsx:77-89`

**Error Codes**:

- `FAKE_EMAIL_DETECTED`: Temporary email addresses not allowed
- `BOT_EMAIL_DETECTED`: Suspicious email pattern detected
- `DUPLICATE_EMAIL`: Email already used recently
- `RATE_LIMITED`: Too many requests

---

### 2. **POST** `/api/email-auth/signup/verify-otp`

**Purpose**: Verify OTP and complete account creation

**Request Data**:

```json
{
  "email": "user@example.com",
  "otp": "123456",
  "password": "password123"
}
```

**Response Data**:

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "isActive": true,
    "securityFlags": {
      "isFakeEmail": false,
      "isBotEmail": false,
      "riskScore": 0,
      "flaggedReasons": []
    }
  }
}
```

**Usage Location**: `src/components/auth/UnifiedAuthForm.tsx:116-129`

---

### 3. **POST** `/api/email-auth/login`

**Purpose**: Login with email and password

**Request Data**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Data**:

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "isActive": true,
    "lastLoginAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Usage Location**: `src/components/auth/UnifiedAuthForm.tsx:161-170`

---

### 4. **POST** `/api/email-auth/refresh`

**Purpose**: Refresh JWT token

**Request Headers**:

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response Data**:

```json
{
  "success": true,
  "token": "new_jwt_token_here"
}
```

**Usage Location**: `src/hooks/useAuth.ts:134-140`

---

### 5. **GET** `/api/email-auth/verify-token`

**Purpose**: Verify current token validity

**Request Headers**:

```
Authorization: Bearer <token>
```

**Response Data**:

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "isVerified": true
  }
}
```

**Usage Location**: `src/utils/secureApiClient.ts:210`

---

### 6. **POST** `/api/email-auth/logout`

**Purpose**: Logout and invalidate token

**Request Headers**:

```
Authorization: Bearer <token>
```

**Response Data**:

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Usage Location**: `src/utils/secureApiClient.ts:214`

---

## 🗳️ Voting Endpoints (Email-based)

### 1. **POST** `/api/email-voting/vote`

**Purpose**: Submit a vote for a participant

**Request Data**:

```json
{
  "participantId": "participant_id_here",
  "categoryId": "Best Actor"
}
```

**Request Headers**:

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response Data**:

```json
{
  "success": true,
  "message": "Vote submitted successfully",
  "data": {
    "voteId": "vote_id",
    "participantId": "participant_id",
    "categoryId": "Best Actor",
    "votedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Usage Location**: `src/utils/secureApiClient.ts:234-238`

**Error Codes**:

- `ALREADY_VOTED`: User already voted for this category
- `VOTING_LIMIT_EXCEEDED`: 24-hour cooldown active
- `EMAIL_NOT_VERIFIED`: Email verification required

---

### 2. **GET** `/api/email-voting/voting-history`

**Purpose**: Get user's voting history

**Request Headers**:

```
Authorization: Bearer <token>
```

**Response Data**:

```json
{
  "success": true,
  "data": [
    {
      "voteId": "vote_id",
      "participantId": "participant_id",
      "participantName": "John Doe",
      "categoryId": "Best Actor",
      "votedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Usage Location**: `src/utils/secureApiClient.ts:227`

---

### 3. **GET** `/api/email-voting/voting-limits`

**Purpose**: Get user's voting restrictions/status

**Request Headers**:

```
Authorization: Bearer <token>
```

**Response Data**:

```json
{
  "success": true,
  "data": {
    "canVote": true,
    "votedCategories": ["Best Actor"],
    "nextVoteTimes": {
      "Best Actor": "2024-01-02T00:00:00.000Z"
    },
    "timeRemaining": {
      "Best Actor": 86400
    }
  }
}
```

**Usage Location**: `src/utils/secureApiClient.ts:223`

---

### 4. **GET** `/api/email-voting/can-vote/:categoryId`

**Purpose**: Check if user can vote for specific category

**Request Headers**:

```
Authorization: Bearer <token>
```

**Response Data**:

```json
{
  "success": true,
  "data": {
    "canVote": false,
    "reason": "Already voted for this category",
    "nextVoteTime": "2024-01-02T00:00:00.000Z",
    "timeRemaining": 86400
  }
}
```

**Usage Location**: `src/utils/secureApiClient.ts:251`

---

### 5. **GET** `/api/email-voting/profile`

**Purpose**: Get user profile information

**Request Headers**:

```
Authorization: Bearer <token>
```

**Response Data**:

```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "isActive": true,
    "lastLoginAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Usage Location**: `src/utils/secureApiClient.ts:206`

---

### 6. **GET** `/api/email-voting/counts`

**Purpose**: Get vote counts for all categories

**Request Headers**:

```
Authorization: Bearer <token>
```

**Response Data**:

```json
{
  "success": true,
  "data": {
    "Best Actor": {
      "totalVotes": 150,
      "participants": [
        {
          "participantId": "participant_id",
          "name": "John Doe",
          "voteCount": 75
        }
      ]
    }
  }
}
```

**Usage Location**: `src/utils/secureApiClient.ts:219`

---

### 7. **GET** `/api/email-voting/category/:category`

**Purpose**: Get participants for a specific category

**Request Headers**:

```
Authorization: Bearer <token>
```

**Response Data**:

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
      "voteCount": 75,
      "image": "image_url"
    }
  ]
}
```

**Usage Location**: `src/utils/secureApiClient.ts:241-244`

---

### 8. **GET** `/api/email-voting/recent`

**Purpose**: Get recent votes (public endpoint)

**Response Data**:

```json
{
  "success": true,
  "data": [
    {
      "categoryId": "Best Actor",
      "participantName": "John Doe",
      "votedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Usage Location**: `src/utils/secureApiClient.ts:247`

---

## 📝 Voting Form/Submissions Endpoints

### 1. **POST** `/api/voting-form/submit`

**Purpose**: Submit a voting form/nomination

**Request Data** (FormData):

```
firstName: "John"
lastName: "Doe"
school: "University of Lagos"
awardCategory: "Best Actor"
picture: [File object]
```

**Request Headers**:

```
X-Requested-With: XMLHttpRequest
```

**Response Data**:

```json
{
  "success": true,
  "message": "Voting form submitted successfully",
  "data": {
    "submissionId": "submission_id",
    "firstName": "John",
    "lastName": "Doe",
    "school": "University of Lagos",
    "awardCategory": "Best Actor",
    "submittedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Usage Location**: `src/components/VotingForm.tsx:123-129`

---

### 2. **GET** `/api/voting-form/categories`

**Purpose**: Get all available categories

**Response Data**:

```json
{
  "success": true,
  "data": ["Best Actor", "Best Actress", "Best Director", "Best Playwright"]
}
```

**Usage Location**: `src/components/AdminSubmissions.tsx:57-59`

---

### 3. **GET** `/api/voting-form/submissions`

**Purpose**: Get all submissions

**Response Data**:

```json
{
  "success": true,
  "data": [
    {
      "_id": "submission_id",
      "firstName": "John",
      "lastName": "Doe",
      "school": "University of Lagos",
      "awardCategory": "Best Actor",
      "picture": "image_url",
      "submittedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Usage Location**: `src/components/AdminSubmissions.tsx:72-74`

---

### 4. **GET** `/api/voting-form/submissions?page=X&limit=Y&offset=Z`

**Purpose**: Get paginated submissions

**Query Parameters**:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `offset`: Offset for pagination

**Response Data**:

```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "_id": "submission_id",
        "firstName": "John",
        "lastName": "Doe",
        "school": "University of Lagos",
        "awardCategory": "Best Actor",
        "picture": "image_url",
        "submittedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

**Usage Location**: `src/components/SubmissionsGrid.tsx:114-116`

---

### 5. **GET** `/api/voting-form/submissions/category/:category`

**Purpose**: Get submissions by category

**Response Data**:

```json
{
  "success": true,
  "data": [
    {
      "_id": "submission_id",
      "firstName": "John",
      "lastName": "Doe",
      "school": "University of Lagos",
      "awardCategory": "Best Actor",
      "picture": "image_url",
      "submittedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Usage Location**: `src/components/SubmissionsGrid.tsx:167-169`

---

### 6. **GET** `/api/voting-form/submissions/:id`

**Purpose**: Get specific submission by ID

**Response Data**:

```json
{
  "success": true,
  "data": {
    "_id": "submission_id",
    "firstName": "John",
    "lastName": "Doe",
    "school": "University of Lagos",
    "awardCategory": "Best Actor",
    "picture": "image_url",
    "submittedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Usage Location**: `src/components/SubmissionsGrid.tsx:224`

---

### 7. **PUT** `/api/voting-form/submissions/:id`

**Purpose**: Update specific submission

**Request Data**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "school": "University of Lagos",
  "awardCategory": "Best Actor"
}
```

**Response Data**:

```json
{
  "success": true,
  "message": "Submission updated successfully",
  "data": {
    "_id": "submission_id",
    "firstName": "John",
    "lastName": "Doe",
    "school": "University of Lagos",
    "awardCategory": "Best Actor",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Usage Location**: `src/components/SubmissionsGrid.tsx:247`

---

## 🔒 Legacy Secure Voting Endpoints (Still Referenced)

### 1. **POST** `/api/secure-votes`

**Purpose**: Submit secure vote (legacy)

**Usage Location**: `src/config/api.ts:50`

---

### 2. **GET** `/api/secure-votes/counts`

**Purpose**: Get vote counts (legacy)

**Usage Location**: `src/config/api.ts:51`

---

### 3. **GET** `/api/secure-votes/my-status`

**Purpose**: Get voting status (legacy)

**Usage Location**: `src/config/api.ts:52`

---

### 4. **GET** `/api/secure-votes/my-history`

**Purpose**: Get voting history (legacy)

**Usage Location**: `src/config/api.ts:53`

---

### 5. **GET** `/api/secure-votes/category/:category`

**Purpose**: Get category participants (legacy)

**Usage Location**: `src/config/api.ts:54-55`

---

### 6. **GET** `/api/secure-votes/queue-status`

**Purpose**: Get queue status (legacy)

**Usage Location**: `src/config/api.ts:56`

---

### 7. **GET** `/api/secure-votes/session-debug`

**Purpose**: Debug session info (legacy)

**Usage Location**: `src/config/api.ts:57`

---

## 🏥 Health/System Endpoints

### 1. **GET** `/health`

**Purpose**: Health check endpoint

**Response Data**:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

**Usage Location**: `src/config/api.ts:58`

---

## 📊 Summary by Category

### **Active Endpoints (Currently Used)**:

- **Email Authentication**: 6 endpoints
- **Email Voting**: 8 endpoints
- **Voting Form/Submissions**: 7 endpoints
- **Health**: 1 endpoint

### **Legacy Endpoints (Still Referenced but May Not Be Active)**:

- **Secure Voting**: 7 endpoints

---

## 🔧 Implementation Files

### **Main API Configuration**:

- `src/config/api.ts` - Base URL and endpoint configuration
- `src/utils/secureApiClient.ts` - API client with all email-based endpoints

### **Authentication**:

- `src/components/auth/UnifiedAuthForm.tsx` - Authentication UI and API calls
- `src/hooks/useAuth.ts` - Authentication state management and token refresh

### **Voting**:

- `src/hooks/useSecureVoting.ts` - Voting logic and API integration
- `src/components/VotingForm.tsx` - Voting form submission

### **Submissions Management**:

- `src/components/SubmissionsGrid.tsx` - Submissions display and management
- `src/components/AdminSubmissions.tsx` - Admin submission management

---

## 🚨 Error Handling

### **Common Error Codes**:

- `FAKE_EMAIL_DETECTED`: Temporary email addresses not allowed
- `BOT_EMAIL_DETECTED`: Suspicious email pattern detected
- `DUPLICATE_EMAIL`: Email already used recently
- `EMAIL_NOT_VERIFIED`: Email verification required
- `ALREADY_VOTED`: User already voted for this category
- `VOTING_LIMIT_EXCEEDED`: 24-hour cooldown active
- `RATE_LIMITED`: Too many requests
- `UNAUTHORIZED`: Authentication required
- `SERVER_ERROR`: Internal server error

### **Rate Limiting**:

- OTP requests: Max 5 requests per 15 minutes per IP
- OTP verification: Max 10 attempts per 15 minutes per IP
- Login attempts: Max 5 attempts per 15 minutes per IP
- Vote submissions: 24-hour cooldown per category

---

## 🔐 Security Features

### **Email Validation**:

- Format validation with regex
- Fake email detection and blocking
- Bot email pattern detection
- Duplicate prevention (24-hour window)

### **Authentication**:

- JWT token-based authentication
- Automatic token refresh
- Secure logout with token invalidation
- Email verification requirement

### **Voting Security**:

- 24-hour rolling window voting restriction
- One vote per category per user
- Email verification before voting
- Rate limiting protection

---

## 📝 Notes

1. **Transition Status**: The application is transitioning from phone-based to email-based authentication
2. **Legacy Support**: Both authentication systems are still referenced in the codebase
3. **Base URL**: All endpoints use the same base URL from environment configuration
4. **Error Handling**: Comprehensive error handling with user-friendly messages
5. **Security**: Multiple layers of security including rate limiting, email validation, and voting restrictions
