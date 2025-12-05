# Vercel Postgres Setup - Step by Step

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Vercel Postgres Database

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your project: **noname-menugang** or **ga-ng**
3. Click **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose region: **Washington, D.C., USA (iad1)** (closest to your deployment)
7. Click **Create**

### Step 2: Get Database Connection String

After database is created:

1. Click on your Postgres database
2. Go to **.env.local** tab
3. Copy the **POSTGRES_PRISMA_URL** value
4. It looks like: `postgresql://default:xxxxx@xxxxx-pooler.aws-us-east-1.postgres.vercel-storage.com/verceldb?pgbouncer=true&connect_timeout=15`

### Step 3: Add to Vercel Environment Variables

```bash
# Run this command in terminal:
vercel env add DATABASE_URL production

# When prompted, paste your POSTGRES_PRISMA_URL
# Press Enter
```

Or manually in Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your `POSTGRES_PRISMA_URL`
   - **Environment**: Production, Preview, Development
3. Click **Save**

### Step 4: Update Local .env.local

Add to your `.env.local` file:
```env
DATABASE_URL="your_postgres_prisma_url_here"
```

### Step 5: Initialize Database Schema

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Verify with Prisma Studio (optional)
npx prisma studio
```

### Step 6: Deploy to Vercel

```bash
vercel --prod --yes
```

## ✅ Verification

After deployment, test these features:

1. **User Registration** - Creates user in database
2. **Upload Asset** - Saves to database
3. **Admin Panel** - Queries real data
4. **Coin System** - Transactions logged
5. **Downloads** - Tracked in database

## 🔍 Check Database

View your data:
```bash
npx prisma studio
```

Or in Vercel Dashboard:
1. Go to **Storage** → Your Postgres database
2. Click **Data** tab
3. Browse tables

## 📊 Database Tables Created

- ✅ User (with coins, membership, admin)
- ✅ Asset (uploads with metadata)
- ✅ Download (history with coins)
- ✅ CoinTransaction (all transactions)
- ✅ Report (moderation)
- ✅ ForumThread (forum posts)
- ✅ ForumReply (forum replies)

## 🐛 Troubleshooting

### Error: "Can't reach database server"
- Check DATABASE_URL is correct
- Verify database is running in Vercel
- Check region/network connectivity

### Error: "Prisma Client not found"
```bash
npx prisma generate
```

### Error: "Table does not exist"
```bash
npx prisma db push --force-reset
```

### View Logs
```bash
vercel logs --prod
```

## 💡 Tips

1. **Free Tier Limits**:
   - 256 MB storage
   - 60 hours compute time/month
   - Upgrade if needed

2. **Connection Pooling**:
   - Already enabled with `pgbouncer=true`
   - Handles multiple connections efficiently

3. **Backup**:
   - Vercel auto-backups daily
   - Export data: `npx prisma db pull`

4. **Monitor Usage**:
   - Check Vercel Dashboard → Storage
   - View queries, storage, compute time

## 🎯 Complete Setup Checklist

- [ ] Vercel Postgres database created
- [ ] DATABASE_URL copied from Vercel
- [ ] DATABASE_URL added to Vercel env variables
- [ ] DATABASE_URL added to local .env.local
- [ ] `npx prisma generate` executed
- [ ] `npx prisma db push` executed
- [ ] Deployed to Vercel: `vercel --prod`
- [ ] Tested user registration
- [ ] Tested asset upload
- [ ] Tested admin panel
- [ ] Verified data in Prisma Studio

## 🎉 Done!

Your database is now fully connected and operational!

All admin features, uploads, and user management now use REAL DATABASE! 🚀
