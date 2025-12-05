# 🚀 Deploy Cepat (3 Cara)

## **1. Ngrok (Paling Cepat - PC Anda)**

### Langkah:
1. Jalankan `start-public.bat`
2. Copy URL dari ngrok (contoh: https://abc123.ngrok.io)
3. Update `config.js` → `appurl` dengan URL ngrok
4. Done! Bot online dan bisa diakses publik

### Kelebihan:
- ✅ Instant (1 menit)
- ✅ Gratis
- ✅ Tidak perlu account

### Kekurangan:
- ❌ PC harus nyala terus
- ❌ URL berubah setiap restart (kecuali pakai akun ngrok)

---

## **2. Render.com (Recommended)**

### Langkah:
1. Push ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "Deploy"
   git remote add origin https://github.com/username/repo.git
   git push -u origin main
   ```

2. Buka https://render.com → Sign up
3. New + → Web Service → Connect GitHub
4. Set environment variables (lihat .env.example)
5. Deploy!

### Kelebihan:
- ✅ Gratis selamanya
- ✅ Online 24/7
- ✅ SSL gratis

---

## **3. Glitch.com (Paling Mudah)**

### Langkah:
1. Buka https://glitch.com
2. New Project → Import from GitHub
3. Paste repo URL
4. Edit .env file
5. Done!

### Kelebihan:
- ✅ Tidak perlu Git
- ✅ Edit langsung di browser
- ✅ Instant deploy

### Kekurangan:
- ❌ Sleep setelah 5 menit idle

---

## **Pilih Mana?**

- **Coba dulu**: Ngrok (1 menit)
- **Production**: Render.com (gratis 24/7)
- **Paling mudah**: Glitch.com
