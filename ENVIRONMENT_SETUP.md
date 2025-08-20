# 🔧 Environment Setup Guide

## 🚨 Fix the "Unauthorized" Error

The "Unauthorized" error occurs because the admin key isn't properly configured. Follow these steps to fix it:

### 1. Create Environment File

Create a `.env.local` file in your project root:

```bash
# In your project root directory
touch .env.local
```

### 2. Add Required Environment Variables

Add these variables to your `.env.local` file:

```env
# Admin authentication key (must match your backend)
ADMIN_KEY=your-secure-admin-key-here

# Backend URL where your cheater detection API is running
BACKEND_URL=http://localhost:10000

# Frontend admin key (for client-side requests)
NEXT_PUBLIC_ADMIN_KEY=your-secure-admin-key-here
```

### 3. Get Your Admin Key

You need to get the admin key from your backend. Check your backend configuration for:

- Environment variable like `ADMIN_KEY` or `SECRET_KEY`
- Configuration file that contains the admin key
- Database or secure storage where the key is stored

**Example backend admin key locations:**

```bash
# Check your backend .env file
cat backend/.env | grep ADMIN_KEY

# Or check your backend configuration
cat backend/config.js | grep adminKey
```

### 4. Restart Your Development Server

After adding the environment variables:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

### 5. Verify Configuration

Check that your environment variables are loaded:

```bash
# Add this temporarily to your page to debug
console.log('Admin Key:', process.env.NEXT_PUBLIC_ADMIN_KEY);
console.log('Backend URL:', process.env.BACKEND_URL);
```

## 🔍 Troubleshooting Authentication

### If you still get "Unauthorized":

1. **Check Backend is Running**:

   ```bash
   # Make sure your backend is running on port 10000
   curl http://localhost:10000/api/admin/cheater-summary
   ```

2. **Test Admin Key Directly**:

   ```bash
   # Test with your admin key
   curl -H "x-admin-key: your-admin-key-here" \
        http://localhost:10000/api/admin/cheater-summary
   ```

3. **Check Environment Variables**:
   ```bash
   # In your Next.js app, add this to debug
   console.log('Environment check:', {
     adminKey: process.env.ADMIN_KEY ? 'Set' : 'Not set',
     publicKey: process.env.NEXT_PUBLIC_ADMIN_KEY ? 'Set' : 'Not set',
     backendUrl: process.env.BACKEND_URL
   });
   ```

## 🤖 Automatic Monitoring Setup

The automatic monitoring feature will:

1. **Scan every 5 minutes** for suspicious IPs
2. **Cross-reference** with your voting database
3. **Update results** automatically
4. **Show real-time alerts** for new suspicious activity

### To enable automatic monitoring:

1. Set up your environment variables (see above)
2. Go to the cheater detection dashboard
3. Click "Start Auto-Monitoring" in the Vercel Data Importer section
4. The system will automatically scan every 5 minutes

## 📊 Expected Behavior

Once properly configured, you should see:

- ✅ Dashboard loads without "Unauthorized" errors
- ✅ Summary statistics display correctly
- ✅ Suspicious IPs table shows data
- ✅ Auto-monitoring works every 5 minutes
- ✅ IP details modal opens when clicking on IPs

## 🛡️ Security Notes

- **Never commit** `.env.local` to version control
- **Use strong, unique** admin keys
- **Rotate keys** regularly
- **Restrict access** to the admin dashboard

## 🆘 Still Having Issues?

If you're still getting authentication errors:

1. **Check your backend logs** for authentication errors
2. **Verify the admin key** matches exactly between frontend and backend
3. **Test the backend API** directly with curl or Postman
4. **Check network connectivity** between frontend and backend

---

**🎯 Once configured, you'll have a fully automated cheater detection system that monitors suspicious IPs every 5 minutes!**
