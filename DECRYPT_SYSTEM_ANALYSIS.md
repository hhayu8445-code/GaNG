# 🔐 FiveM CFX V7 Decrypt System - Complete Analysis

## 📋 System Overview

Sistem decrypt ini adalah **FiveM CFX Resource Decryptor** yang terintegrasi dengan:
- Discord Bot untuk processing
- Web interface untuk upload
- Keymaster API integration
- Automatic decompilation (Lua bytecode → readable Lua)

---

## 🏗️ Architecture

### **1. Frontend (Web Interface)**
- **Location**: `/app/decrypt/page.tsx`
- **Features**:
  - File upload (drag & drop)
  - Discord bot processing option
  - Download ID system
  - Real-time status tracking

### **2. Backend API**
- **Location**: `/app/api/decrypt/route.ts`
- **Endpoints**:
  - `POST /api/decrypt` - Upload & decrypt
  - `GET /api/decrypt?jobId=xxx` - Check status
  - `GET /api/decrypt/download/[id]` - Download result

### **3. Discord Bot System**
- **Location**: `/app/decrypt/src/`
- **Components**:
  - `decryptor.js` - Core decryption logic
  - `discord-logger.js` - Webhook notifications
  - `vouch-system.js` - User reputation
  - `backup.js` - Auto backup results

---

## 🔧 How It Works

### **Step 1: File Upload**
```
User uploads .zip/.lua/.luac file
↓
Frontend validates file type
↓
Generates Job ID (16 hex) & Download ID (8 hex)
↓
Sends to API endpoint
```

### **Step 2: Processing Options**

#### **Option A: Web Processing (Direct)**
```
API receives file
↓
Detects encryption (0x1b header for Lua, FXAP for CFX)
↓
Decrypts using ChaCha20 cipher
↓
Decompiles Lua bytecode (unluac54.jar)
↓
Returns decrypted code
↓
Stores with Download ID
```

#### **Option B: Discord Bot Processing**
```
API sends webhook to Discord
↓
Discord bot receives notification
↓
Bot downloads file from session
↓
Extracts .zip → finds .fxap file
↓
Reads Resource ID from .fxap
↓
Checks blacklist
↓
Fetches grants from Keymaster API
↓
Decrypts all files in resource
↓
Decompiles Lua files
↓
Creates backup .zip
↓
Sends download link to user DM
```

---

## 🔑 Decryption Process (Technical)

### **1. CFX Resource Structure**
```
resource_name/
├── .fxap (encrypted metadata)
├── client.lua (encrypted)
├── server.lua (encrypted)
└── config.lua (encrypted)
```

### **2. Encryption Layers**

#### **Layer 1: FXAP Header**
- Header: `46 58 41 50` (FXAP)
- Contains Resource ID at offset 74-78
- Encrypted with default ChaCha20 key

#### **Layer 2: ChaCha20 Encryption**
- **Default Key**: Hardcoded in config
- **IV**: Extracted from file (offset 74-86)
- **Algorithm**: ChaCha20 stream cipher

#### **Layer 3: AES-256-CBC (for grants_clk)**
- Used for client-side keys
- **Key**: Hardcoded AES key
- **IV**: First 16 bytes of grants_clk

### **3. Keymaster Integration**

```javascript
// Validate CFX Key
cfxk_xxxxx → Keymaster API
↓
Returns grants_token (JWT)
↓
Decode JWT payload
↓
Extract grants[resourceId] = decryption key
Extract grants_clk[resourceId] = client key
```

### **4. Decompilation**

```bash
# Lua bytecode → readable Lua
java -jar unluac54.jar encrypted.luac > decrypted.lua
```

---

## 📊 Database Structure

### **sessions/** (User decrypt sessions)
```
sessions/
└── [DISCORD_USER_ID]/
    ├── Uploads/        # Original uploaded files
    ├── Resources/      # Extracted resource files
    ├── TempCompiled/   # Temporary bytecode
    └── Output/         # Final decrypted files
```

### **backup/** (Auto backups)
```
backup/
└── [USERNAME]_[USER_ID]_[RESOURCE]_[TIMESTAMP]/
    ├── [resource]_decrypted.zip
    └── info.txt
```

### **database/** (JSON storage)
- `data.json` - Decrypt history
- `blacklist.json` - Blocked resource IDs
- `vouches.json` - User reputation
- `api-keys.json` - API authentication

---

## 🌐 API Integration

### **External APIs**

#### **1. FiveM Keymaster**
```
GET https://keymaster.fivem.net/api/validate/cfxk_xxxxx
Headers: User-Agent: CitizenFX/1
```

#### **2. AllGamers Grants API**
```
GET https://keymaster.allgamers.dev/api/grants/search/[resourceId]
POST https://keymaster.allgamers.dev/api/grants
Body: { cfxKey: "cfxk_xxxxx" }
```

---

## 🔒 Security Features

### **1. Blacklist System**
- Blocks specific Resource IDs
- Prevents decryption of protected resources
- Admin-managed list

### **2. Vouch System**
- User reputation tracking
- Limits abuse
- Admin can vouch/unvouch users

### **3. Session Management**
- Unique session per user
- Auto-cleanup after 24 hours
- Isolated file storage

### **4. Rate Limiting**
- Max file size: 500 MB
- Timeout: 10 seconds per API call
- Proxy support for IP rotation

---

## 🚀 Deployment

### **Environment Variables**
```env
# Discord Bot
DISCORD_TOKEN=MTxxxxx.Xxxxxx.xxxxx
DISCORD_CLIENT_ID=1234567890
DISCORD_GUILD_ID=1234567890
DISCORD_LOG_CHANNEL_ID=1234567890
DISCORD_DECRYPT_WEBHOOK=https://discord.com/api/webhooks/...

# Web Server
NEXT_PUBLIC_SITE_URL=https://www.fivemtools.net
APP_URL=https://www.fivemtools.net

# Ports
SERVER_PORT=3000
API_PORT=3001

# Admin
ADMIN_DISCORD_ID=1047719075322810378
```

### **Required Tools**
- **Java Runtime** (for unluac54.jar)
- **Node.js** 18+
- **Discord Bot** with file upload permissions

---

## 📝 Usage Flow

### **For Users:**
1. Upload encrypted resource (.zip)
2. Choose: Web or Discord processing
3. Receive Download ID (e.g., `A3F8B2C1`)
4. Download from: `/decrypt/download/A3F8B2C1`

### **For Admins:**
- View all decrypt jobs
- Check statistics
- Manage blacklist
- Review vouch system

---

## ⚠️ Important Notes

1. **Legal**: Only decrypt resources you own or have permission
2. **Keys**: Never commit crypto keys to git
3. **Blacklist**: Some resources are protected and cannot be decrypted
4. **CFX Key**: Required for new resources not in grants database
5. **Java**: Must be installed for Lua decompilation

---

## 🔗 Integration Points

### **Current Web Integration:**
- ✅ Upload interface
- ✅ Download ID system
- ✅ Discord webhook notifications
- ✅ Job status tracking
- ✅ Admin statistics

### **Missing (To Implement):**
- ⚠️ Discord bot server (separate Node.js process)
- ⚠️ Database persistence (currently in-memory)
- ⚠️ Actual decryption logic (currently simulated)
- ⚠️ File storage system
- ⚠️ Cleanup cron jobs

---

## 📦 Dependencies

```json
{
  "chacha20": "^1.0.4",
  "discord.js": "^14.x",
  "axios": "^1.x",
  "https-proxy-agent": "^7.x"
}
```

---

## 🎯 Next Steps

1. **Deploy Discord Bot** as separate service
2. **Connect Web API** to bot via webhooks
3. **Implement database** (PostgreSQL/MongoDB)
4. **Add file storage** (S3/local filesystem)
5. **Setup cron jobs** for cleanup
6. **Add monitoring** and error tracking

---

**System Status**: ✅ Web interface ready | ⚠️ Bot integration pending
