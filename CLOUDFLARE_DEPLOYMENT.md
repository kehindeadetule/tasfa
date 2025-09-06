# Cloudflare Pages Deployment Guide

## Overview

This guide will help you deploy the TASFA frontend to Cloudflare Pages with proper environment configuration and backend integration.

## Prerequisites

### 1. Install Dependencies

```bash
# Install updated dependencies
npm install

# Install Wrangler CLI globally
npm install -g wrangler
```

### 2. Cloudflare Account Setup

1. Create a Cloudflare account at [cloudflare.com](https://cloudflare.com)
2. Go to Pages section
3. Connect your GitHub repository

## Configuration Files

### ✅ Already Configured:

- `package.json` - Updated with Cloudflare dependencies and scripts
- `next.config.js` - Configured for static export with security headers
- `wrangler.toml` - Cloudflare Pages configuration
- Environment variables setup

## Deployment Methods

### Method 1: Cloudflare Dashboard (Recommended)

1. **Connect Repository**:

   - Go to Cloudflare Dashboard → Pages
   - Click "Create a project"
   - Connect your GitHub repository
   - Select the `tasfa` repository

2. **Build Settings**:

   ```
   Framework preset: Next.js (Static HTML Export)
   Build command: npm run pages:build
   Build output directory: out
   Root directory: / (leave empty)
   ```

3. **Environment Variables**:

   ```
   NEXT_PUBLIC_API_BASE_URL=https://tasfa-be.onrender.com
   NEXT_PUBLIC_ENV=production
   NODE_ENV=production
   ```

4. **Deploy**:
   - Click "Save and Deploy"
   - Wait for build to complete

### Method 2: Wrangler CLI

1. **Login to Cloudflare**:

   ```bash
   wrangler login
   ```

2. **Build and Deploy**:

   ```bash
   # Build for Cloudflare Pages
   npm run pages:build

   # Deploy to Cloudflare Pages
   wrangler pages deploy out --project-name=tasfa-frontend
   ```

3. **Set Environment Variables**:
   ```bash
   wrangler pages secret put NEXT_PUBLIC_API_BASE_URL --project-name=tasfa-frontend
   wrangler pages secret put NEXT_PUBLIC_ENV --project-name=tasfa-frontend
   ```

## Environment Configuration

### Production Environment Variables

```bash
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=https://tasfa-be.onrender.com

# Environment identifier
NEXT_PUBLIC_ENV=production

# Node environment
NODE_ENV=production
```

### Staging Environment Variables

```bash
# Backend API URL (staging)
NEXT_PUBLIC_API_BASE_URL=https://staging-api.yourdomain.com

# Environment identifier
NEXT_PUBLIC_ENV=staging

# Node environment
NODE_ENV=production
```

## Build Process

### Local Testing

```bash
# Test the build locally
npm run pages:build

# Preview the build
npm run preview
```

### Production Build

```bash
# Build for production
npm run build

# Build for Cloudflare Pages
npm run pages:build
```

## Custom Domain Setup

1. **Add Custom Domain**:

   - Go to Cloudflare Pages → Your Project → Custom domains
   - Add your domain (e.g., `www.tasfa.com.ng`)

2. **DNS Configuration**:

   - Add CNAME record pointing to your Cloudflare Pages URL
   - Enable SSL/TLS

3. **Update Redirects**:
   - The `next.config.js` already includes HTTPS redirects
   - Update the destination URL in the redirect configuration

## Security Features

### ✅ Included Security Headers:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### ✅ HTTPS Redirects:

- Automatic HTTP to HTTPS redirects in production
- Secure cookie settings
- CSP headers (can be added if needed)

## Backend Integration

### API Endpoints

The frontend is configured to use these backend endpoints:

- Authentication: `https://tasfa-be.onrender.com/api/auth/*`
- Voting: `https://tasfa-be.onrender.com/api/secure-votes/*`

### CORS Configuration

Ensure your backend has proper CORS settings:

```javascript
// Backend CORS configuration
app.use(
  cors({
    origin: [
      "https://your-cloudflare-domain.pages.dev",
      "https://www.tasfa.com.ng",
    ],
    credentials: false, // Since we use JWT tokens
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
```

## Monitoring and Analytics

### Cloudflare Analytics

- Built-in analytics in Cloudflare Dashboard
- Real-time visitor statistics
- Performance metrics

### Error Monitoring

- Cloudflare Error Pages
- Browser console monitoring
- API error tracking

## Troubleshooting

### Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run pages:build
```

### Environment Variables Not Working

1. Check variable names (must start with `NEXT_PUBLIC_`)
2. Verify in Cloudflare Dashboard → Pages → Settings → Environment variables
3. Redeploy after adding variables

### API Connection Issues

1. Verify backend URL is correct
2. Check CORS configuration on backend
3. Test API endpoints directly

### Static Export Issues

1. Ensure no server-side code in components
2. Check for dynamic imports
3. Verify all API calls use environment variables

## Performance Optimization

### Cloudflare Features

- **CDN**: Global content delivery
- **Caching**: Automatic static asset caching
- **Compression**: Gzip/Brotli compression
- **Image Optimization**: WebP conversion

### Next.js Optimizations

- Static export for fast loading
- Image optimization disabled (handled by Cloudflare)
- Trailing slashes for better caching

## Deployment Checklist

- [ ] Dependencies updated (`npm install`)
- [ ] Environment variables configured
- [ ] Build tested locally (`npm run pages:build`)
- [ ] Backend CORS configured
- [ ] Custom domain set up (if needed)
- [ ] SSL certificate active
- [ ] Analytics configured
- [ ] Error monitoring set up

## Quick Deploy Commands

```bash
# Full deployment process
npm install
npm run pages:build
wrangler pages deploy out --project-name=tasfa-frontend

# Or use the npm script
npm run deploy
```

## Support

For issues with:

- **Cloudflare Pages**: Check Cloudflare documentation
- **Next.js Build**: Check Next.js static export docs
- **Environment Variables**: Verify in Cloudflare Dashboard
- **Backend Integration**: Check CORS and API endpoints

Your TASFA application is now ready for Cloudflare Pages deployment! 🚀
