# FiveM Tools V7

Platform lengkap untuk resource FiveM dengan sistem forum, marketplace, dan manajemen user.

## 🚀 Quick Start

### 1. Clone & Setup
```bash
git clone <your-repo-url>
cd noname-menugang
npm install
npm run setup
```

### 2. Database Setup
```bash
# Setup database
npx prisma migrate dev
npx prisma db seed
```

### 3. Run Development
```bash
npm run dev
```

## 🔧 Environment Variables

Setelah menjalankan `npm run setup`, update file `.env.local`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/fivemtools"
NEXTAUTH_SECRET="generated-secret"
NEXTAUTH_URL="http://localhost:3000"
DISCORD_CLIENT_ID="your_discord_client_id"
DISCORD_CLIENT_SECRET="your_discord_client_secret"
UPLOADTHING_SECRET="your_uploadthing_secret"
UPLOADTHING_APP_ID="your_uploadthing_app_id"
```

## 📦 Deployment

### Auto Deploy ke Vercel
1. Push ke GitHub
2. Connect repository ke Vercel
3. Set environment variables di Vercel dashboard
4. Deploy otomatis setiap push ke main branch

### Manual Deploy
```bash
npm run deploy
```

## 🗄️ Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Deploy migrations (production)
npx prisma migrate deploy

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## 🔄 GitHub Actions

Workflow otomatis akan:
- ✅ Install dependencies
- ✅ Setup environment
- ✅ Run database migrations
- ✅ Seed database
- ✅ Build application
- ✅ Deploy ke Vercel

## 📋 Features

- 🎮 Asset marketplace (Scripts, MLO, Vehicles, Clothing)
- 💬 Forum system dengan categories
- 👤 Discord OAuth authentication
- 💰 Coin system untuk premium assets
- 📁 File upload dengan UploadThing
- 🎨 Modern UI dengan Tailwind CSS
- 📱 Responsive design

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js + Discord
- **UI**: Tailwind CSS + Radix UI
- **Upload**: UploadThing
- **Deployment**: Vercel