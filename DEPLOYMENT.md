# Deployment Guide - FiveM Tools V7

## 🚀 Deploy to Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
cd d:\noname-menugang
vercel --prod
```

## 📋 Environment Variables (Set in Vercel Dashboard)

Go to: **Project Settings → Environment Variables**

### Required Variables:

1. **DISCORD_CLIENT_ID**
   - Get from: https://discord.com/developers/applications
   - Example: `1234567890123456789`

2. **DISCORD_CLIENT_SECRET**
   - Get from: Discord Developer Portal
   - Example: `abcdef1234567890`

3. **DISCORD_REDIRECT_URI**
   - Format: `https://your-domain.vercel.app/api/auth/callback`
   - Example: `https://fivem-tools.vercel.app/api/auth/callback`

4. **VIRUSTOTAL_API_KEY**
   - Get from: https://www.virustotal.com/gui/my-apikey
   - Example: `your_virustotal_api_key_here`

5. **SESSION_SECRET**
   - Generate: `openssl rand -base64 32`
   - Example: `random_32_character_string_here`

6. **ADMIN_DISCORD_ID**
   - Your Discord User ID
   - Example: `123456789012345678`

7. **NEXT_PUBLIC_SITE_URL**
   - Your Vercel domain
   - Example: `https://fivem-tools.vercel.app`

8. **NEXT_PUBLIC_SITE_NAME**
   - Value: `FiveM Tools V7`

## 🔧 Quick Deploy Commands

### Option 1: Vercel CLI (Recommended)
```bash
# First time deployment
vercel

# Production deployment
vercel --prod

# Check deployment status
vercel ls
```

### Option 2: GitHub Integration
1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel auto-deploys on push

### Option 3: Vercel Dashboard
1. Go to https://vercel.com/new
2. Import Git Repository
3. Configure environment variables
4. Deploy

## 📝 Pre-Deployment Checklist

- [ ] All environment variables set
- [ ] Discord OAuth redirect URI updated
- [ ] Database configured (if using)
- [ ] File upload directory configured
- [ ] CORS settings configured
- [ ] Rate limiting enabled
- [ ] Security headers enabled
- [ ] Analytics configured

## 🔒 Security Settings

### Discord OAuth Setup:
1. Go to Discord Developer Portal
2. Add redirect URI: `https://your-domain.vercel.app/api/auth/callback`
3. Save changes

### Vercel Security:
1. Enable HTTPS only
2. Set secure headers
3. Configure CORS
4. Enable rate limiting

## 📊 Post-Deployment

### Verify Deployment:
1. Visit your site
2. Test Discord login
3. Test file upload
4. Test coin system
5. Test admin panel
6. Check all API routes

### Monitor:
- Check Vercel Analytics
- Monitor error logs
- Check performance metrics
- Review security logs

## 🐛 Troubleshooting

### Build Errors:
```bash
# Clear cache and rebuild
vercel --force

# Check build logs
vercel logs
```

### Environment Variables:
```bash
# List all env vars
vercel env ls

# Add env var
vercel env add VARIABLE_NAME

# Remove env var
vercel env rm VARIABLE_NAME
```

### Rollback:
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote [deployment-url]
```

## 🎯 Performance Optimization

- Enable Edge Functions
- Configure CDN caching
- Optimize images
- Enable compression
- Use ISR for static pages

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Discord: https://discord.gg/vercel
- GitHub Issues: Create issue in repository

## 🔄 Continuous Deployment

### Auto-deploy on Git push:
1. Connect GitHub repository
2. Enable auto-deploy
3. Configure branch settings
4. Set up preview deployments

### Manual deploy:
```bash
vercel --prod
```

## ✅ Deployment Complete!

Your FiveM Tools V7 is now live on Vercel! 🎉

Visit: https://your-domain.vercel.app
