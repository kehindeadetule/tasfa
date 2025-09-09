# Secure Phone-Based Voting System

## Overview

This document describes the new secure phone-based authentication and voting system that replaces the previous session/IP-based voting system. The new system provides enhanced security through Email Address verification and JWT token authentication.

## Key Features

### 🔐 Authentication System

- **Email Address Verification**: Users must verify their Email Address via SMS OTP
- **JWT Token Authentication**: Secure token-based authentication with 24-hour expiration
- **Rate Limiting**: Prevents abuse with configurable rate limits
- **Session Management**: Automatic token refresh and secure logout

### 🗳️ Voting System

- **Phone-Based Voting**: Votes are tied to verified Email Addresss instead of IP/session
- **24-Hour Category Lock**: Users can only vote once per category every 24 hours
- **Secure Vote Tracking**: All votes are recorded with Email Address, timestamp, and metadata
- **Real-time Status**: Users can view their voting history and status

### 🛡️ Security Measures

- **OTP Verification**: 6-digit SMS codes with 10-minute expiration
- **Rate Limiting**: Multiple layers of rate limiting (per phone, per IP, per action)
- **Input Sanitization**: All user inputs are sanitized and validated
- **JWT Security**: Tokens are signed and verified on each request
- **Audit Trail**: Complete voting history with timestamps and metadata

## API Endpoints

### Authentication Endpoints

#### Send OTP

```
POST /api/auth/send-otp
Content-Type: application/json

{
  "phoneNumber": "+2348012345678",
  "mode": "login" // or "signup"
}
```

**Rate Limits:**

- 3 OTP requests per Email Address per hour
- 10 OTP requests per IP per hour

#### Verify OTP

```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phoneNumber": "+2348012345678",
  "otp": "123456"
}
```

**Rate Limits:**

- 5 verification attempts per Email Address per hour
- 20 verification attempts per IP per hour

#### Refresh Token

```
POST /api/auth/refresh
Authorization: Bearer <token>
```

### Voting Endpoints

#### Submit Vote

```
POST /api/votes/secure-vote
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "school": "University of Lagos",
  "awardCategory": "Best Actor",
  "participantId": "participant123"
}
```

**Rate Limits:**

- 1 vote per Email Address per category per 24 hours
- 5 votes per Email Address per hour
- 10 votes per IP per hour

#### Get Voting History

```
GET /api/votes/secure-vote
Authorization: Bearer <token>
```

## Components

### Authentication Components

#### PhoneAuthForm

- Handles Email Address input and OTP verification
- Supports both signup and login modes
- Includes rate limiting and error handling

#### AuthGuard

- Protects routes that require authentication
- Shows login form for unauthenticated users
- Handles loading states and error conditions

### Voting Components

#### SecureVotingForm

- Displays participants for a specific category
- Handles vote submission with authentication
- Shows voting status and restrictions

#### SimpleVotingOverview

- Displays user's voting history and statistics
- Shows security features and status
- Includes logout functionality

## Hooks

### useAuth

- Manages authentication state and user data
- Handles login, logout, and token refresh
- Provides authentication headers for API calls

### useSecureVoting

- Manages voting state for a specific category
- Handles vote submission and status checking
- Integrates with authentication system

## Security Features

### Rate Limiting

- **OTP Requests**: 3 per Email Address, 10 per IP per hour
- **OTP Verification**: 5 per Email Address, 20 per IP per hour
- **Voting**: 1 per category per 24 hours, 5 per hour per phone, 10 per hour per IP

### Input Validation

- Email Addresss must be valid Nigerian numbers (+234 format)
- OTP codes must be exactly 6 digits
- All text inputs are sanitized and length-limited
- File uploads are validated for type and size

### Token Security

- JWT tokens with 24-hour expiration
- Automatic token refresh
- Secure token storage in localStorage
- Token validation on every request

## Environment Variables

```env
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=production
```

## Usage

### For Users

1. **Sign Up/Login**: Enter your Nigerian Email Address
2. **Verify Phone**: Enter the 6-digit OTP sent via SMS
3. **Vote**: Select your preferred candidate in each category
4. **View History**: Check your voting progress and history

### For Developers

1. **Install Dependencies**: `npm install jsonwebtoken @types/jsonwebtoken`
2. **Set Environment Variables**: Configure JWT_SECRET
3. **Deploy**: The system is ready for production use

## Migration from Old System

The new system completely replaces the old session/IP-based voting system:

- **Old System**: Used localStorage and IP tracking (vulnerable to manipulation)
- **New System**: Uses phone verification and JWT tokens (secure and auditable)

### Breaking Changes

- All users must re-authenticate with Email Addresss
- Voting history is reset (old votes are not migrated)
- New API endpoints replace old ones
- Authentication is now required for all voting operations

## Production Considerations

### SMS Integration

Currently uses console logging for OTP. In production, integrate with:

- Twilio
- AWS SNS
- Other SMS providers

### Database

Currently uses in-memory storage. In production, use:

- PostgreSQL
- MongoDB
- Redis for rate limiting

### Monitoring

- Set up logging for all authentication attempts
- Monitor rate limiting triggers
- Track voting patterns for anomalies

## Testing

### Development Mode

- OTP codes are logged to console
- Rate limits are relaxed
- Debug information is available

### Production Mode

- OTP codes sent via SMS
- Full rate limiting enabled
- Debug information hidden

## Support

For issues or questions about the secure voting system, please refer to the code documentation or contact the development team.
