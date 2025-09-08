# Email Authentication Implementation Guide

## Overview

This document describes the implementation of the email-based authentication and voting system for TASFA Awards. The system has been successfully migrated from phone number OTP to email OTP with enhanced security features.

## 🔄 Migration Summary

### What Changed

1. **Authentication Method**: Phone number → Email address
2. **API Endpoints**: Updated to use `/api/email-auth/*` and `/api/email-voting/*`
3. **Token Storage**: Updated localStorage keys from `tasfa_auth_token` to `tasfa_a_t`
4. **User Interface**: Updated forms to use email input instead of phone number
5. **Error Handling**: Added email-specific error codes and messages

### What Remains the Same

- All voting functionality and restrictions
- 24-hour rolling window voting system
- Security features and rate limiting
- UI/UX design and user experience
- All existing voting components and hooks

## 📁 Files Modified

### Core Authentication Files

1. **`src/hooks/useAuth.ts`**

   - Updated User interface to use email instead of phoneNumber
   - Changed localStorage keys to email-based
   - Updated API endpoints to email-auth routes

2. **`src/components/auth/UnifiedAuthForm.tsx`**

   - Replaced phone number input with email input
   - Updated validation functions
   - Added email-specific error handling
   - Updated API calls to use email endpoints

3. **`src/utils/secureApiClient.ts`**
   - Updated all authentication methods to use email
   - Changed voting endpoints to email-voting routes
   - Added email-specific error codes
   - Updated token storage references

### Supporting Files

4. **`package.json`**

   - Added `test:email-auth` script for integration testing

5. **`test-email-auth.js`** (New)
   - Integration test script for email authentication
   - Tests endpoint availability, validation, and rate limiting

## 🚀 API Endpoints

### Authentication Endpoints

| Endpoint                             | Method | Description                   |
| ------------------------------------ | ------ | ----------------------------- |
| `/api/email-auth/signup/request-otp` | POST   | Request OTP for new account   |
| `/api/email-auth/signup/verify-otp`  | POST   | Verify OTP and create account |
| `/api/email-auth/login`              | POST   | Login with email and password |
| `/api/email-auth/login/request-otp`  | POST   | Request OTP for login         |
| `/api/email-auth/login/verify-otp`   | POST   | Verify OTP for login          |

### Voting Endpoints

| Endpoint                                 | Method | Description               |
| ---------------------------------------- | ------ | ------------------------- |
| `/api/email-voting/vote`                 | POST   | Submit a vote             |
| `/api/email-voting/voting-history`       | GET    | Get user's voting history |
| `/api/email-voting/voting-limits`        | GET    | Get voting restrictions   |
| `/api/email-voting/can-vote/:categoryId` | GET    | Check voting permission   |
| `/api/email-voting/profile`              | GET    | Get user profile          |

## 🔐 Security Features

### Email Validation

- **Format Validation**: Standard email regex validation
- **Fake Email Detection**: Blocks known temporary email services
- **Bot Email Detection**: Identifies suspicious email patterns
- **Duplicate Prevention**: Prevents same email registration within 24 hours

### Rate Limiting

- **OTP Requests**: Max 5 requests per 15 minutes per IP
- **OTP Verification**: Max 10 attempts per 15 minutes per IP
- **Login Attempts**: Max 5 attempts per 15 minutes per IP

### Voting Restrictions

- **24-Hour Cooldown**: One vote per category every 24 hours
- **Email Verification**: Must verify email before voting
- **Account Status**: Active and unlocked account required
- **Duplicate Prevention**: Cannot vote for same participant twice

## 🧪 Testing

### Integration Test

Run the integration test to verify the email authentication system:

```bash
npm run test:email-auth
```

This test will:

- Check endpoint availability
- Test email validation (including fake email detection)
- Verify rate limiting
- Test the authentication flow

### Manual Testing

1. **Registration Flow**:

   - Go to `/auth`
   - Enter a valid email and password
   - Click "Send Verification Code"
   - Check email for OTP
   - Enter OTP and complete registration

2. **Login Flow**:

   - Go to `/auth`
   - Enter registered email and password
   - Click "Sign In"

3. **Voting Flow**:
   - Navigate to any category page
   - Vote for a participant
   - Verify 24-hour restriction is applied

## 🔧 Configuration

### Environment Variables

Ensure these environment variables are set in your backend:

```env
# Brevo Configuration
BREVO_API_KEY=your_brevo_api_key

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

### Brevo Setup

1. Create a Brevo account at [brevo.com](https://brevo.com)
2. Go to SMTP & API settings
3. Generate an API key
4. Update the `BREVO_API_KEY` in your environment variables
5. Optionally, verify your sender domain for better deliverability

## 🐛 Error Handling

### Email-Specific Error Codes

| Code                    | Description              | User Message                                                                  |
| ----------------------- | ------------------------ | ----------------------------------------------------------------------------- |
| `FAKE_EMAIL_DETECTED`   | Temporary email detected | "Temporary email addresses are not allowed"                                   |
| `BOT_EMAIL_DETECTED`    | Suspicious email pattern | "Suspicious email pattern detected"                                           |
| `DUPLICATE_EMAIL`       | Email used recently      | "Email already used recently. Please use a different email or wait 24 hours." |
| `EMAIL_NOT_VERIFIED`    | Email not verified       | "Please verify your email address before voting"                              |
| `VOTING_LIMIT_EXCEEDED` | Voting limit reached     | "You can vote again in X hours"                                               |
| `RATE_LIMITED`          | Too many requests        | "Too many requests. Please try again later."                                  |

## 📊 Monitoring

The system tracks:

- Email OTP requests and verifications
- Login attempts and failures
- Voting patterns and restrictions
- Security flags and risk scores
- Device fingerprints and IP addresses

## 🔄 Rollback Plan

If you need to rollback to the phone system:

1. **Revert API endpoints** in `secureApiClient.ts`:

   ```typescript
   // Change back to phone endpoints
   "/api/auth/signup/request-otp"; // instead of "/api/email-auth/signup/request-otp"
   ```

2. **Revert localStorage keys** in `useAuth.ts`:

   ```typescript
   localStorage.getItem("tasfa_auth_token"); // instead of "tasfa_a_t"
   ```

3. **Revert UI components** in `UnifiedAuthForm.tsx`:
   - Change email input back to phone number input
   - Update validation functions

## 🎯 Next Steps

1. **Deploy Backend**: Ensure all email authentication endpoints are deployed
2. **Test Integration**: Run the integration test script
3. **Monitor Performance**: Watch for any issues with email delivery
4. **User Feedback**: Collect feedback on the new email-based system
5. **Documentation**: Update user-facing documentation

## 📞 Support

If you encounter any issues:

1. Check the browser console for errors
2. Run the integration test: `npm run test:email-auth`
3. Verify environment variables are set correctly
4. Check Brevo API key and configuration
5. Review backend logs for detailed error messages

## ✅ Checklist

- [x] Updated `useAuth` hook for email authentication
- [x] Updated `UnifiedAuthForm` component
- [x] Updated `secureApiClient` with email endpoints
- [x] Added email-specific error handling
- [x] Created integration test script
- [x] Updated package.json with test script
- [x] Created implementation documentation
- [ ] Deploy backend with email authentication
- [ ] Test complete user flow
- [ ] Monitor system performance
- [ ] Update user documentation

---

**Note**: The phone number system has been completely replaced with the email system. Both systems cannot run simultaneously as they use different localStorage keys and API endpoints.
