# Event Registration Backend API Documentation

This document provides the exact API specifications needed to implement the backend endpoints for the Event Registration system, matching the frontend implementation.

## Overview

The Event Registration system requires 3 main endpoints:

1. **POST** `/api/event-registration` - Create new registration
<!-- 2. **GET** `/api/event-registration/confirm/:token` - Confirm registration via email (DISABLED) -->
2. **GET** `/api/event-registration/status/:email` - Check registration status

## Database Schema

### EventRegistration Model

```javascript
{
  // Basic Information
  name: String (required, max 100 chars),
  email: String (required, unique, validated),
  phoneNumber: String (required, validated),

  // Profile
  image: String (S3 URL, optional),
  gender: String (required, enum: ["male", "female", "other", "prefer-not-to-say"]),

  // Professional Information
  occupation: String (required, max 100 chars),
  organization: String (required, max 200 chars),

  // Event Information
  daysAttending: [String] (required, min 1 item, enum: ["Day 1", "Day 2", "Day 3", "All Days"]),
  accommodationReservation: String (required, enum: ["yes", "no"]),

  // System Fields
  status: String (enum: ["pending", "confirmed", "cancelled"], default: "pending"),
  // emailConfirmed: Boolean (default: false),
  // confirmationToken: String (auto-generated, unique),
  // confirmationTokenExpires: Date (24 hours from creation),

  // Admin Fields
  adminNotes: String (max 500 chars, optional),
  checkedIn: Boolean (default: false),
  checkedInAt: Date (optional),
  checkedInBy: String (optional),

  // Metadata
  registrationSource: String (default: "web-form"),
  ipAddress: String,
  userAgent: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## API Endpoints

### 1. Create Registration

#### POST `/api/event-registration`

**Request Body (multipart/form-data):**

```javascript
{
  name: "John Doe",                    // String, required
  email: "john@example.com",           // String, required, unique
  phoneNumber: "+2348012345678",       // String, required
  gender: "male",                      // String, required, enum
  occupation: "Student",               // String, required
  organization: "University of Lagos", // String, required
  daysAttending: '["Day 1", "Day 2"]', // JSON string, required
  accommodationReservation: "yes",     // String, required, enum
  image: File                          // File, optional (max 5MB)
}
```

**Validation Rules:**

- `name`: Required, max 100 characters
- `email`: Required, valid email format, must be unique
- `phoneNumber`: Required, valid phone number format
- `gender`: Required, must be one of: "male", "female", "other", "prefer-not-to-say"
- `occupation`: Required, max 100 characters
- `organization`: Required, max 200 characters
- `daysAttending`: Required, must be valid JSON array with at least 1 item
- `accommodationReservation`: Required, must be "yes" or "no"
- `image`: Optional, max 5MB, must be image file (jpg, png, gif, webp)

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "Registration successful!",
  // "message": "Registration successful! Please check your email to confirm your registration.",
  "data": {
    "registrationId": "ABC12345",
    "email": "john@example.com",
    "status": "pending"
    // "emailSent": true
  }
}
```

**Response (Error - 400/500):**

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

**Backend Implementation Notes:**

1. Generate unique `registrationId` (e.g., random string + timestamp)
<!-- 2. Create `confirmationToken` (crypto.randomBytes(32).toString('hex')) -->
<!-- 3. Set `confirmationTokenExpires` to 24 hours from now -->
2. Upload image to S3 if provided
<!-- 5. Send confirmation email with token -->
3. Return success response

---

<!-- ### 2. Email Confirmation

#### GET `/api/event-registration/confirm/:token`

**COMMENTED OUT - EMAIL CONFIRMATION DISABLED**

**URL Parameters:**

- `token`: String, required - The confirmation token from email

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Registration confirmed successfully!",
  "data": {
    "registrationId": "ABC12345",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "confirmed"
  }
}
```

**Response (Error - 400/404):**

```json
{
  "success": false,
  "message": "Invalid or expired confirmation token"
}
```

**Backend Implementation Notes:**

1. Find registration by `confirmationToken`
2. Check if token is not expired (`confirmationTokenExpires > now`)
3. Update: `emailConfirmed: true`, `status: "confirmed"`
4. Clear or invalidate the confirmation token
5. Return registration details

**Error Cases:**

- Token not found: "Invalid confirmation token"
- Token expired: "Confirmation token has expired"
- Already confirmed: "Registration already confirmed"

-->

---

### 3. Registration Status Check

#### GET `/api/event-registration/status/:email`

**URL Parameters:**

- `email`: String, required - Email address to check

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
  "registrationId": "ABC12345",
  "name": "John Doe",
  "email": "john@example.com",
  "status": "confirmed",
  // "emailConfirmed": true,
  "daysAttending": ["Day 1", "Day 2"],
  "accommodationReservation": "yes",
  "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Error - 404):**

```json
{
  "success": false,
  "message": "Registration not found"
}
```

**Backend Implementation Notes:**

1. Find registration by email address
2. Return registration details (exclude sensitive fields like tokens)
3. Include all relevant information for status display

---

## Frontend Data Interfaces

### RegistrationFormData (Frontend)

```typescript
interface RegistrationFormData {
  name: string;
  email: string;
  phoneNumber: string;
  image: File | null;
  gender: string;
  occupation: string;
  organization: string;
  daysAttending: string[];
  accommodationReservation: string;
}
```

### Registration (Frontend)

```typescript
interface Registration {
  _id: string;
  registrationId: string;
  name: string;
  email: string;
  phoneNumber: string;
  image?: string;
  gender: string;
  occupation: string;
  organization: string;
  daysAttending: string[];
  accommodationReservation: string;
  status: "pending" | "confirmed" | "cancelled";
  emailConfirmed: boolean;
  checkedIn: boolean;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### ConfirmationData (Frontend)

```typescript
interface ConfirmationData {
  registrationId: string;
  name: string;
  email: string;
  status: string;
}
```

---

<!-- ## Email Template Requirements

### Confirmation Email

**COMMENTED OUT - EMAIL CONFIRMATION DISABLED**

**Subject:** "Confirm Your TASFA Event Registration"

**Content:**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Confirm Your Registration</title>
  </head>
  <body>
    <h2>Welcome to TASFA!</h2>
    <p>Hello {{name}},</p>
    <p>
      Thank you for registering for the Theatre Arts Students Festival and
      Awards!
    </p>

    <p>Please click the button below to confirm your registration:</p>
    <a
      href="{{frontendUrl}}/confirm/{{confirmationToken}}"
      style="background: #005B96; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;"
    >
      Confirm Registration
    </a>

    <p>Registration Details:</p>
    <ul>
      <li><strong>Name:</strong> {{name}}</li>
      <li><strong>Email:</strong> {{email}}</li>
      <li><strong>Organization:</strong> {{organization}}</li>
      <li><strong>Days Attending:</strong> {{daysAttending}}</li>
      <li><strong>Accommodation:</strong> {{accommodationReservation}}</li>
    </ul>

    <p>This confirmation link will expire in 24 hours.</p>
    <p>If you didn't register for this event, please ignore this email.</p>

    <p>Best regards,<br />TASFA Team</p>
  </body>
</html>
```

-->

---

## Error Handling

### Common Error Responses

**Validation Errors (400):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "phoneNumber": "Invalid phone number format"
  }
}
```

**Duplicate Email (409):**

```json
{
  "success": false,
  "message": "Email already registered"
}
```

**File Upload Errors (400):**

```json
{
  "success": false,
  "message": "Invalid file type. Only images are allowed"
}
```

**Server Errors (500):**

```json
{
  "success": false,
  "message": "Internal server error. Please try again later"
}
```

---

## Security Considerations

### Rate Limiting

- Registration: 5 attempts per IP per hour
- Status Check: 20 requests per IP per hour
<!-- - Confirmation: 10 attempts per IP per hour (DISABLED) -->

### Input Validation

- Sanitize all text inputs
- Validate file uploads (type, size)
- Validate email format and uniqueness
- Validate phone number format
- Validate enum values

<!-- ### Token Security (DISABLED - EMAIL CONFIRMATION DISABLED)

- Generate cryptographically secure tokens
- Set reasonable expiration times (24 hours)
- Invalidate tokens after use
- Don't expose tokens in error messages

-->

---

## Environment Variables

```bash
# Required
S3_BUCKET_NAME=your-s3-bucket
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL for email links
FRONTEND_URL=https://your-frontend-domain.com

# Database
DATABASE_URL=your-database-connection-string
```

---

## Testing

### Test Registration

```bash
curl -X POST http://localhost:3000/api/event-registration \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "phoneNumber=+2348012345678" \
  -F "gender=male" \
  -F "occupation=Student" \
  -F "organization=Test University" \
  -F "daysAttending=[\"Day 1\"]" \
  -F "accommodationReservation=no"
```

### Test Confirmation

```bash
curl -X GET http://localhost:3000/api/event-registration/confirm/TOKEN_HERE
```

### Test Status Check

```bash
curl -X GET "http://localhost:3000/api/event-registration/status/test@example.com"
```

---

This documentation provides everything needed to implement the backend endpoints that match the frontend implementation exactly.
