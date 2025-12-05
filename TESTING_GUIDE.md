# 🧪 TESTING GUIDE

## Pre-Testing Setup

1. **Run Database Seed**
```bash
npm run seed
```

2. **Start Development Server**
```bash
npm run dev
```

3. **Login as Admin**
- Discord ID: `1047719075322810378`
- Should have 999,999 coins

## Test Cases

### ✅ TEST 1: Coins Display Real-Time
**Steps**:
1. Login to the application
2. Check sidebar - should show your current coins
3. Wait 5 seconds - coins should auto-refresh if changed elsewhere

**Expected Result**:
- Coins display correctly from database
- Auto-refresh every 5 seconds

---

### ✅ TEST 2: Daily Coins Claim
**Steps**:
1. Click "Daily Coins" button in sidebar
2. Click "Claim 20 Coins"
3. Wait for success message
4. Check sidebar coins

**Expected Result**:
- Coins increase by 20
- Sidebar updates immediately
- Can't claim again for 24 hours

---

### ✅ TEST 3: Download Free Asset
**Steps**:
1. Go to Scripts page
2. Find a free asset (0 coins)
3. Click "Download Free"
4. Verify download starts

**Expected Result**:
- Download starts immediately
- No coins deducted
- Download record created in database

---

### ✅ TEST 4: Download Premium Asset
**Steps**:
1. Go to Scripts page
2. Find a premium asset (e.g., 300 coins)
3. Click "Download (300 Coins)"
4. Review the modal showing balance
5. Click "Confirm"
6. Check sidebar coins

**Expected Result**:
- Modal shows current balance, cost, and new balance
- Coins deducted after download
- Sidebar updates immediately
- Download record created
- CoinTransaction created

---

### ✅ TEST 5: Download with Insufficient Coins
**Steps**:
1. Create a test user with low coins (e.g., 50 coins)
2. Try to download 300 coin asset
3. Click "Confirm"

**Expected Result**:
- Error message: "Insufficient coins"
- No download
- Coins not deducted

---

### ✅ TEST 6: Admin Add Asset
**Steps**:
1. Login as admin
2. Go to Admin Panel
3. Click "Add Asset" in Quick Actions
4. Fill in the form:
   - Title: "Test Asset"
   - Description: "This is a test"
   - Category: Scripts
   - Framework: QBCore
   - Coin Price: 100
   - Version: 1.0.0
   - Download Link: /uploads/test.zip
   - Thumbnail: /placeholder.jpg
   - Tags: test, demo
5. Click "Add Asset"

**Expected Result**:
- Success message appears
- Page refreshes
- Asset appears in Scripts page
- Asset saved in database

---

### ✅ TEST 7: Upload Asset
**Steps**:
1. Login as any user
2. Go to Upload page
3. Upload a ZIP file
4. Wait for virus scan (will show clean)
5. Fill in all required fields
6. Upload a thumbnail image
7. Click "Upload Asset"

**Expected Result**:
- File uploads successfully
- Redirects to asset detail page
- Asset appears in Scripts page
- Files saved in /public/uploads/

---

### ✅ TEST 8: Forum Threads
**Steps**:
1. Go to Forum page
2. Verify threads are displayed

**Expected Result**:
- 6 threads visible
- "Welcome to FiveM Tools V7!" is pinned
- Threads show views and likes
- Can click to view thread details

---

### ✅ TEST 9: Duplicate Download Prevention
**Steps**:
1. Download a premium asset (300 coins)
2. Try to download the same asset again

**Expected Result**:
- Second download is free (already purchased)
- No additional coins deducted
- Download still works

---

### ✅ TEST 10: Session Refresh
**Steps**:
1. Open browser DevTools → Network tab
2. Stay on any page for 10 seconds
3. Watch for `/api/auth/session` requests

**Expected Result**:
- Session API called every 5 seconds
- Coins updated in real-time
- No page refresh needed

---

## Database Verification

### Check Coins Update
```sql
SELECT discordId, username, coins FROM "User";
```

### Check Transactions
```sql
SELECT * FROM "CoinTransaction" ORDER BY "createdAt" DESC LIMIT 10;
```

### Check Downloads
```sql
SELECT * FROM "Download" ORDER BY "createdAt" DESC LIMIT 10;
```

### Check Assets
```sql
SELECT id, title, coinPrice, downloads FROM "Asset" ORDER BY "createdAt" DESC LIMIT 10;
```

### Check Forum Threads
```sql
SELECT id, title, views, likes FROM "ForumThread";
```

---

## Common Issues & Solutions

### Issue: Coins not updating in sidebar
**Solution**: Check browser console for errors. Verify `/api/auth/session` is being called.

### Issue: Download not deducting coins
**Solution**: Check if user has enough coins. Verify download API response in Network tab.

### Issue: Admin modal not opening
**Solution**: Verify you're logged in as admin. Check `isAdmin` flag in session.

### Issue: Upload fails
**Solution**: Check file size (max 500MB). Verify uploads directory exists.

### Issue: Forum empty
**Solution**: Run `npm run seed` to populate forum threads.

---

## Performance Checks

- [ ] Page loads in < 2 seconds
- [ ] Sidebar coins update without lag
- [ ] Download starts immediately
- [ ] Modal animations are smooth
- [ ] No console errors
- [ ] No memory leaks (check DevTools Memory tab)

---

## Security Checks

- [ ] Non-admin users can't access admin panel
- [ ] Can't download with insufficient coins
- [ ] Can't claim daily coins twice
- [ ] Session expires after logout
- [ ] File uploads are validated
- [ ] SQL injection prevented (Prisma handles this)

---

## Browser Compatibility

Test on:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## Final Checklist

- [ ] All 10 test cases pass
- [ ] Database queries return expected data
- [ ] No console errors
- [ ] No network errors
- [ ] Performance is acceptable
- [ ] Security checks pass
- [ ] Works on all browsers

**If all tests pass, you're ready for production! 🚀**
