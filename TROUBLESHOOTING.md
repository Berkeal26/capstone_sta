# Troubleshooting Guide - Smart Travel Assistant v2.0.0

## 🚨 **Common Issues & Solutions**

### 1. Dashboard Not Appearing
**Problem:** You ask about flights but don't see the dashboard.

**Solution:**
- Use keywords: "flight", "price", "ticket", "booking", "search flights"
- Try: "Find flights to Paris" or "Show me ticket prices"
- Check browser console (F12) for errors

### 2. Server Won't Start
**Problem:** `Address already in use` error.

**Solution:**
```bash
# Kill existing servers
pkill -f "python3 -m http.server"
lsof -ti:3000 | xargs kill -9

# Start fresh
./start.sh
```

### 3. Build Errors
**Problem:** `npm run build` fails.

**Solution:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 4. Node.js Version Issues
**Problem:** Build fails with Node version errors.

**Solution:**
```bash
# Use Node 18
nvm use 18
npm run build
```

### 5. Dashboard Shows "Demo Data"
**Problem:** Dashboard appears but shows demo data instead of real data.

**This is Normal:** The app uses mock data for demonstration. Real Amadeus API integration requires API keys.

### 6. Chat Not Responding
**Problem:** Messages don't get responses.

**Solution:**
- Check if backend is running: `curl https://capstone-79wenhjg2-berkes-projects-f48a9605.vercel.app/api/health`
- Check browser network tab for API errors
- Try refreshing the page

## 🔧 **Development Commands**

### Start Development Server
```bash
npm start
```

### Build for Production
```bash
npm run build
```

### Serve Built App
```bash
cd build && python3 -m http.server 3000
```

### Check Server Status
```bash
lsof -ti:3000  # Check if port 3000 is in use
```

## 🐛 **Debug Steps**

1. **Check Console Errors:**
   - Open browser DevTools (F12)
   - Look for red errors in Console tab

2. **Check Network Requests:**
   - DevTools → Network tab
   - Look for failed API calls

3. **Verify Backend:**
   ```bash
   curl https://capstone-79wenhjg2-berkes-projects-f48a9605.vercel.app/api/health
   ```

4. **Check Build:**
   ```bash
   ls -la build/  # Should show index.html and static files
   ```

## 📞 **Still Having Issues?**

1. **Restart Everything:**
   ```bash
   pkill -f "python3 -m http.server"
   rm -rf build/
   npm run build
   ./start.sh
   ```

2. **Check File Permissions:**
   ```bash
   chmod +x start.sh
   ```

3. **Verify Dependencies:**
   ```bash
   npm list --depth=0
   ```

## 🎯 **Expected Behavior**

### Working Correctly:
- ✅ Home page loads with "Wayfinder" branding
- ✅ Chat interface responds to messages
- ✅ Dashboard appears when asking about flights
- ✅ Dashboard shows maps, charts, and tables
- ✅ Split-view layout works properly

### Not Working:
- ❌ Blank page or errors
- ❌ Chat doesn't respond
- ❌ Dashboard never appears
- ❌ JavaScript errors in console

---
**Need Help?** Check the console errors and follow the debug steps above.
