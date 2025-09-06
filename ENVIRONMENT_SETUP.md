# Environment Setup Guide

## Overview

This guide explains how to properly configure environment variables for the TASFA application to ensure secure and flexible API endpoint configuration.

## Security Best Practices

### ✅ Safe Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (safe to expose to browser)
- `NEXT_PUBLIC_ENV` - Environment identifier (safe to expose to browser)

### ❌ Never Put in NEXT*PUBLIC* Variables

- Database credentials
- API keys
- JWT secrets
- Private tokens
- Any sensitive data

## Environment Configuration

### 1. Create Environment File

Run the setup script:

```bash
./setup-env.sh
```

Or manually create `.env.local`:

```bash
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Environment
NEXT_PUBLIC_ENV=development
```

### 2. Environment-Specific URLs

#### Development (Local)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_ENV=development
```

#### Staging

```bash
NEXT_PUBLIC_API_BASE_URL=https://staging-api.yourdomain.com
NEXT_PUBLIC_ENV=staging
```

#### Production

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_ENV=production
```

## How It Works

### 1. Environment Detection

The application automatically detects the environment based on:

1. `NEXT_PUBLIC_ENV` environment variable
2. Hostname detection (localhost = development)
3. Fallback to production for safety

### 2. API URL Resolution

```typescript
// From src/config/api.ts
const API_CONFIG = {
  development: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  production:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://tasfa-be.onrender.com",
  staging:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://tasfa-be.onrender.com",
};
```

### 3. Automatic Fallbacks

- If `NEXT_PUBLIC_API_BASE_URL` is not set, uses environment-specific defaults
- Development defaults to `http://localhost:3001`
- Production defaults to `https://tasfa-be.onrender.com`

## File Structure

```
tasfa/
├── .env.local                 # Local environment (gitignored)
├── .env.example              # Example environment file
├── setup-env.sh              # Environment setup script
├── src/
│   └── config/
│       ├── api.ts            # API configuration
│       └── environment.ts    # Environment utilities
└── ENVIRONMENT_SETUP.md      # This guide
```

## Deployment Considerations

### Local Development

1. Run `./setup-env.sh` to create `.env.local`
2. Start your backend server on port 3001
3. Run `npm run dev`

### Production Deployment

1. Set environment variables in your deployment platform:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com
   NEXT_PUBLIC_ENV=production
   ```
2. Deploy the application

### Vercel Deployment

```bash
# Set environment variables in Vercel dashboard or CLI
vercel env add NEXT_PUBLIC_API_BASE_URL
vercel env add NEXT_PUBLIC_ENV
```

## Troubleshooting

### Issue: "undefined" in API URL

**Problem**: URL shows as `http://localhost:3000/undefined/api/...`
**Solution**:

1. Check if `.env.local` exists
2. Verify `NEXT_PUBLIC_API_BASE_URL` is set
3. Restart the development server

### Issue: CORS Errors

**Problem**: API calls fail with CORS errors
**Solution**:

1. Ensure backend server is running
2. Check backend CORS configuration
3. Verify API URL is correct

### Issue: Environment Not Detected

**Problem**: Wrong environment detected
**Solution**:

1. Set `NEXT_PUBLIC_ENV` explicitly
2. Check hostname detection logic
3. Verify environment variable format

## Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] No sensitive data in `NEXT_PUBLIC_` variables
- [ ] Production URLs use HTTPS
- [ ] Environment variables are set in deployment platform
- [ ] Backend API has proper CORS configuration
- [ ] JWT secrets are only in backend environment

## Quick Start

1. **Setup Environment**:

   ```bash
   ./setup-env.sh
   ```

2. **Start Backend** (on port 3001):

   ```bash
   # Your backend server
   npm start
   ```

3. **Start Frontend**:

   ```bash
   npm run dev
   ```

4. **Test**: Open http://localhost:3000

The application will now use the configured backend API endpoints securely.
