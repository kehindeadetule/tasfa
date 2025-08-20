# 🚨 Cheater Detection System Setup

This guide will help you set up the cheater detection dashboard to identify participants using multiple tabs and incognito mode for voting.

## 📋 Prerequisites

- Your backend cheater detection API is running (with all the endpoints from the documentation)
- Next.js frontend application
- Environment variables configured

## 🔧 Environment Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Admin authentication key (must match your backend)
ADMIN_KEY=your-secure-admin-key-here

# Backend URL where your cheater detection API is running
BACKEND_URL=http://localhost:10000

# Frontend admin key (for client-side requests)
NEXT_PUBLIC_ADMIN_KEY=your-secure-admin-key-here
```

## 🚀 Quick Start

1. **Install Dependencies** (if not already installed):

   ```bash
   npm install
   ```

2. **Start the Development Server**:

   ```bash
   npm run dev
   ```

3. **Access the Dashboard**:
   Navigate to `http://localhost:3000/admin/cheater-detection`

## 📊 Dashboard Features

### 1. **Vercel Data Importer**

- Paste IP data from your Vercel Edge Requests dashboard
- Automatically parses and extracts suspicious IP addresses
- Cross-references with your voting database

### 2. **Suspicious IPs Table**

- Shows all IPs with suspicious voting patterns
- Displays risk scores, incognito usage, and device diversity
- Click on any IP to see detailed analysis

### 3. **Affected Participants**

- Lists all participants affected by suspicious voting
- Shows incognito vote percentages and device breakdown
- Identifies which participants are being targeted

### 4. **Analytics & Charts**

- Risk level distribution
- Device usage analysis
- Incognito usage trends

## 🔍 How to Use with Vercel Data

1. **Get Vercel Data**:

   - Go to your Vercel dashboard
   - Navigate to Observability → Edge Requests
   - Copy the table data (IP, Requests, Cached columns)

2. **Import to Dashboard**:

   - Paste the data into the Vercel Data Importer
   - Click "Parse Data" to extract IP addresses
   - Click "Analyze IPs" to cross-reference with voting data

3. **Review Results**:
   - Check the Suspicious IPs tab for high-risk addresses
   - Review the Affected Participants tab to see which nominees are affected
   - Use the IP Details modal for deep analysis

## 🎯 Key Metrics to Monitor

### High Risk Indicators:

- **Incognito Usage > 70%**: Very suspicious
- **Multiple Devices**: Indicates coordinated voting
- **High Vote Volume**: Unusual activity patterns
- **Risk Score > 80**: Requires immediate attention

### Participant Flags:

- **High Incognito Percentage**: Participant receiving many incognito votes
- **Multiple Suspicious IPs**: Participant targeted by multiple cheaters
- **Unusual Vote Patterns**: Sudden spikes in voting activity

## 🔧 API Endpoints Used

The dashboard uses these backend endpoints:

- `GET /api/admin/cheater-summary` - Overall statistics
- `GET /api/admin/suspicious-ips` - List of suspicious IPs
- `GET /api/admin/affected-participants` - Affected participants
- `GET /api/admin/ip-details/{ipAddress}` - Detailed IP analysis
- `GET /api/admin/monitoring-status` - Real-time monitoring
- `GET /api/admin/export-data` - Data export

## 🛡️ Security Considerations

1. **Admin Key**: Use a strong, unique admin key
2. **Environment Variables**: Never commit `.env.local` to version control
3. **Access Control**: Restrict dashboard access to authorized personnel only
4. **Rate Limiting**: Implement rate limiting on API endpoints

## 🚨 Troubleshooting

### Common Issues:

1. **"Unauthorized" Error**:

   - Check that `ADMIN_KEY` matches your backend
   - Verify the key is correctly set in environment variables

2. **"Backend Connection Error"**:

   - Ensure your backend is running on the correct port
   - Check `BACKEND_URL` environment variable
   - Verify network connectivity

3. **"No Data Displayed"**:
   - Check if your backend has voting data
   - Verify API endpoints are working
   - Check browser console for errors

### Debug Mode:

Add this to your `.env.local` for debugging:

```env
NODE_ENV=development
DEBUG=true
```

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure your backend API is running and accessible
4. Check network connectivity between frontend and backend

## 🎉 Success Indicators

You'll know the system is working when:

- Dashboard loads with summary statistics
- Suspicious IPs table shows data
- Affected participants are listed
- IP details modal displays comprehensive information
- Vercel data import works correctly

---

**🎯 Ready to catch cheaters!** The dashboard will help you identify and flag participants using multiple tabs and incognito mode for voting manipulation.
