# CloudPulse - Quick Start Guide

## 🚀 Try It Now

Visit the live demo: **https://cloud-pulse-two.vercel.app**

No installation required! Start testing website latency immediately.

---

## What is CloudPulse?

CloudPulse is a web-based latency monitoring tool that measures:
- ⚡ Response time (milliseconds)
- 📊 HTTP status codes
- 📦 Response size
- 📈 Performance trends over time

---

## How to Use

### 1. Test a Single URL (Home Page)
1. Visit https://cloud-pulse-two.vercel.app
2. Enter any URL (e.g., `https://google.com`)
3. Click **"Analyze"**
4. View instant results:
   - Response time in milliseconds
   - HTTP status code (200, 404, etc.)
   - Response size in KB/MB
   - Timestamp of the test

### 2. View Dashboard
1. Click **"Dashboard"** in the navigation
2. See overview statistics:
   - Total tests run
   - Average response time
   - Fastest and slowest response
3. Select a URL from the dropdown to see:
   - **Line chart**: Latency trends over time
   - **Bar chart**: Compare performance across URLs
4. View full test history in the table below

### 3. Compare Multiple URLs
1. Click **"Compare"** in the navigation
2. Enter up to 10 URLs
3. Click **"Run All Tests"**
4. See side-by-side comparison with:
   - Fastest URL highlighted in green
   - Slowest URL highlighted in red
   - Summary table with all metrics

---

## Features

✅ **Real-time Testing** - Get results in under 1 second  
✅ **Historical Data** - All tests are saved and visualized  
✅ **Multi-URL Comparison** - Test up to 10 URLs at once  
✅ **Visual Charts** - Line and bar charts for easy analysis  
✅ **Mobile Friendly** - Works on phone, tablet, and desktop  
✅ **Secure** - SSRF protection blocks malicious requests  

---

## Example URLs to Test

Try these popular websites:
- `https://google.com`
- `https://github.com`
- `https://amazon.com`
- `https://youtube.com`
- `https://netflix.com`
- `https://wikipedia.org`

---

## Understanding Results

### Response Time
- **< 100ms**: Excellent ⚡
- **100-300ms**: Good ✅
- **300-1000ms**: Average ⚠️
- **> 1000ms**: Slow 🐌

### Status Codes
- **200**: Success (page loaded)
- **301/302**: Redirect
- **404**: Not Found
- **500**: Server Error
- **Timeout**: Server didn't respond

### Error Types
- **DNS**: Domain name doesn't exist
- **ECONNREFUSED**: Server refused connection
- **ETIMEDOUT**: Request took too long
- **NETWORK**: General network error

---

## Local Development

Want to run CloudPulse on your own machine?

### Prerequisites
- Node.js 18+
- npm

### Quick Setup
```bash
# Clone repository
git clone https://github.com/pradhip-koirala/cloud_pulse.git
cd cloud_pulse

# Start backend
cd backend
npm install
npm start

# In new terminal, start frontend
cd frontend
npm install
npm run dev

# Open browser to http://localhost:5173
```

For detailed setup instructions, see `SETUP.md`.

---

## Production Architecture

**Frontend**: Vercel (React + Vite + Tailwind CSS)  
**Backend**: Render (Node.js + Express)  
**Database**: MongoDB Atlas  
**Charts**: Chart.js  

---

## Documentation

- `README.md` - Complete project overview
- `SETUP.md` - Detailed local setup guide
- `DEPLOYMENT.md` - Production deployment guide
- `PROJECT_SUMMARY.md` - Full project statistics
- `TEST_CHECKLIST.md` - Testing validation

---

## Support

**Found a bug?** Open an issue on GitHub  
**Have questions?** Check the documentation  
**Want to contribute?** Fork and submit a PR  

---

## License

ISC - Free to use and modify

---

**Enjoy monitoring your websites with CloudPulse!** 🎉
