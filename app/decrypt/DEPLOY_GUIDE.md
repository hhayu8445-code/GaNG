# 🚀 Panduan Deploy Gratis

## **Render.com (Recommended - Gratis Selamanya)**

### **Langkah Deploy:**

1. **Push ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/repo.git
   git push -u origin main
   ```

2. **Daftar di Render.com**
   - Buka https://render.com
   - Sign up dengan GitHub
   - Gratis, tidak perlu kartu kredit

3. **Deploy Bot**
   - Klik **New +** → **Web Service**
   - Connect repository GitHub Anda
   - Pilih repository bot
   - Settings:
     - **Name**: fivecfx-decrypt-bot
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `node index.js`
     - **Instance Type**: Free

4. **Set Environment Variables**
   Di Render dashboard, tambahkan:
   ```
   DISCORD_TOKEN = your_bot_token
   CLIENT_ID = your_client_id
   GUILD_ID = your_guild_id
   LOG_CHANNEL_ID = your_log_channel_id
   VOUCH_CHANNEL_ID = your_vouch_channel_id
   APP_URL = https://your-app-name.onrender.com/
   ```

5. **Deploy!**
   - Klik **Create Web Service**
   - Tunggu 5-10 menit
   - Bot akan online!

### **URL Bot:**
`https://your-app-name.onrender.com/`

---

## **Railway.app (Alternatif)**

### **Langkah Deploy:**

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login & Deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Set Variables**
   ```bash
   railway variables set DISCORD_TOKEN=your_token
   railway variables set CLIENT_ID=your_id
   railway variables set GUILD_ID=your_guild
   railway variables set LOG_CHANNEL_ID=your_log
   railway variables set VOUCH_CHANNEL_ID=your_vouch
   ```

4. **Generate Domain**
   ```bash
   railway domain
   ```

### **Free Tier:**
- $5 credit gratis/bulan
- Cukup untuk bot kecil-menengah

---

## **Glitch.com (Paling Mudah)**

### **Langkah Deploy:**

1. **Buka https://glitch.com**
2. **New Project** → **Import from GitHub**
3. Paste URL repo GitHub
4. Edit `.env` file di Glitch:
   ```
   DISCORD_TOKEN=your_token
   CLIENT_ID=your_id
   GUILD_ID=your_guild
   LOG_CHANNEL_ID=your_log
   VOUCH_CHANNEL_ID=your_vouch
   ```
5. Bot langsung jalan!

### **Catatan:**
- Bot sleep setelah 5 menit tidak ada aktivitas
- Gunakan UptimeRobot.com untuk keep alive

---

## **Keep Alive (Agar Bot Tidak Sleep)**

### **UptimeRobot.com:**
1. Daftar gratis di https://uptimerobot.com
2. Add New Monitor:
   - Type: HTTP(s)
   - URL: `https://your-app.onrender.com/`
   - Interval: 5 minutes
3. Bot akan selalu online!

---

## **Perbandingan:**

| Platform | Free Tier | Sleep? | Limit |
|----------|-----------|--------|-------|
| **Render.com** | ✅ Selamanya | ❌ Tidak | 750 jam/bulan |
| **Railway.app** | ✅ $5/bulan | ❌ Tidak | $5 credit |
| **Glitch.com** | ✅ Selamanya | ✅ Ya (5 min) | Unlimited |
| **Heroku** | ❌ Paid | - | - |

---

## **Rekomendasi:**
**Render.com** - Paling stabil, gratis, tidak sleep!

---

## **Troubleshooting:**

### **Bot tidak online:**
- Cek environment variables sudah benar
- Cek logs di dashboard platform
- Pastikan port menggunakan `process.env.PORT`

### **Web tidak bisa diakses:**
- Pastikan `APP_URL` sudah diset
- Cek firewall/security settings

### **Bot sleep:**
- Gunakan UptimeRobot untuk ping setiap 5 menit
