# Database Setup Guide - FiveM Tools V7

## 🗄️ Database Configuration

### Option 1: Vercel Postgres (Recommended for Production)

1. **Create Vercel Postgres Database**
   ```bash
   # Go to Vercel Dashboard
   # Navigate to Storage → Create Database → Postgres
   ```

2. **Get Connection String**
   - Copy the `POSTGRES_PRISMA_URL` from Vercel
   - Add to environment variables

3. **Set Environment Variable**
   ```bash
   vercel env add DATABASE_URL production
   # Paste your POSTGRES_PRISMA_URL
   ```

### Option 2: Supabase (Free Tier Available)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project

2. **Get Connection String**
   - Go to Project Settings → Database
   - Copy Connection String (Transaction Mode)
   - Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

3. **Add to .env.local**
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
   ```

### Option 3: Railway (Free Tier Available)

1. **Create Railway Project**
   - Go to https://railway.app
   - New Project → Provision PostgreSQL

2. **Get Connection String**
   - Click on PostgreSQL service
   - Copy `DATABASE_URL`

3. **Add to Environment**
   ```env
   DATABASE_URL="postgresql://..."
   ```

### Option 4: Local PostgreSQL

1. **Install PostgreSQL**
   ```bash
   # Windows: Download from postgresql.org
   # Mac: brew install postgresql
   # Linux: sudo apt install postgresql
   ```

2. **Create Database**
   ```bash
   psql -U postgres
   CREATE DATABASE fivemtools;
   \q
   ```

3. **Set Connection String**
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/fivemtools"
   ```

## 📦 Prisma Setup

### 1. Install Dependencies
```bash
npm install @prisma/client
npm install -D prisma
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Push Database Schema
```bash
npx prisma db push
```

### 4. Open Prisma Studio (Optional)
```bash
npx prisma studio
```

## 🚀 Deployment Steps

### For Vercel Deployment:

1. **Add DATABASE_URL to Vercel**
   ```bash
   vercel env add DATABASE_URL production
   # Paste your database connection string
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Run Migrations (if needed)**
   ```bash
   # Vercel will automatically run prisma generate during build
   ```

## 🔧 Environment Variables

Add these to your `.env.local` and Vercel:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Discord OAuth
DISCORD_CLIENT_ID="your_client_id"
DISCORD_CLIENT_SECRET="your_client_secret"
DISCORD_REDIRECT_URI="https://your-domain.vercel.app/api/auth/callback"
ADMIN_DISCORD_ID="your_discord_user_id"

# Session
SESSION_SECRET="random_32_character_string"

# VirusTotal
VIRUSTOTAL_API_KEY="your_virustotal_api_key"

# Site
NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"
NEXT_PUBLIC_SITE_NAME="FiveM Tools V7"
```

## 📊 Database Models

The database includes:
- **User** - User accounts with coins, membership, admin status
- **Asset** - Uploaded assets (scripts, vehicles, MLOs, clothing)
- **Download** - Download history with coin transactions
- **CoinTransaction** - All coin transactions (add, spend, daily claim)
- **Report** - User reports for moderation
- **ForumThread** - Forum threads
- **ForumReply** - Forum replies

## 🔍 Verify Database Connection

```bash
# Test connection
npx prisma db pull

# View data
npx prisma studio
```

## ⚠️ Important Notes

1. **Never commit .env.local** - It contains sensitive data
2. **Use connection pooling** - For production (Prisma handles this)
3. **Backup regularly** - Set up automated backups
4. **Monitor usage** - Check database size and queries
5. **Use indexes** - Already configured in schema for performance

## 🐛 Troubleshooting

### Connection Error
```bash
# Check if DATABASE_URL is set
echo $DATABASE_URL

# Test connection
npx prisma db pull
```

### Migration Issues
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Push schema without migration
npx prisma db push --force-reset
```

### Prisma Client Not Found
```bash
# Regenerate client
npx prisma generate
```

## ✅ Checklist

- [ ] Database created (Vercel/Supabase/Railway/Local)
- [ ] DATABASE_URL added to .env.local
- [ ] DATABASE_URL added to Vercel environment variables
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Database schema pushed (`npx prisma db push`)
- [ ] Connection tested (`npx prisma studio`)
- [ ] All other environment variables configured
- [ ] Application deployed and tested

## 🎯 Next Steps

After database setup:
1. Deploy to Vercel: `vercel --prod`
2. Test user registration (creates user in database)
3. Test asset upload (saves to database)
4. Test admin panel (queries database)
5. Monitor database usage in provider dashboard

Your database is now fully integrated! 🎉
