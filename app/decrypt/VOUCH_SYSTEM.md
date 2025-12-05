# 🎯 Vouch System Documentation

## Overview
The vouch system requires users to post a vouch message before they can use the decrypt feature. If a user deletes their vouch, they are automatically and permanently banned from the Discord server.

## Configuration

### config.js
```javascript
discord: {
    vouchChannelId: '1404489502851989684'  // Channel where vouches must be posted
}
```

## How It Works

### 1. **User Posts Vouch**
- User posts a message in the vouch channel
- System automatically registers the vouch
- User can now use `/decrypt` command
- Log entry created: "✅ New Vouch Posted"

### 2. **User Tries to Decrypt**
- System checks if user has an active vouch
- Admins bypass vouch requirement
- If no vouch: User receives error message with instructions
- If vouch exists: Decrypt proceeds normally
- Log entry created: "❌ Decrypt Blocked - No Vouch" (if no vouch)

### 3. **User Deletes Vouch**
- System detects message deletion in vouch channel
- Vouch is marked as inactive
- User is **permanently banned** from the server
- Log entry created: "⚠️ Vouch Deleted - User Banned"

## Log Entries

### ✅ New Vouch Posted
```
User: username#1234 (1234567890)
Message ID: 1234567890123456789
Vouch Content: [First 200 characters]
Posted At: 1/15/2025, 10:30:00 AM
```

### ❌ Decrypt Blocked - No Vouch
```
User: username#1234 (1234567890)
File: resource.zip
Reason: No vouch posted
```

### ✅ Successful Decryption (Enhanced)
```
User: username#1234 (1234567890)
File: resource.zip
Session ID: 1234567890123456789
Resources: 45
Payment: Credit/Subscription
Time: 1/15/2025, 10:35:00 AM
Vouch Status: Active (Posted: 1/15/2025)
License Key: [if provided]
```

### ⚠️ Vouch Deleted - User Banned
```
User ID: 1234567890
Message ID: 1234567890123456789
Banned: Yes/Failed
Original Vouch: [First 100 characters]
Posted At: 1/15/2025, 10:30:00 AM
Deleted At: 1/15/2025, 11:00:00 AM
```

## Database Structure

### vouches.json
```json
{
  "vouches": {
    "1234567890": {
      "messageId": "1234567890123456789",
      "content": "Great service! Highly recommend!",
      "timestamp": "2025-01-15T10:30:00.000Z",
      "active": true,
      "deletedAt": null
    }
  }
}
```

## Admin Bypass
Users in the `adminUsers` array automatically bypass the vouch requirement.

## User Instructions

### To Use Decrypt:
1. Go to vouch channel: <#1404489502851989684>
2. Post your vouch message (testimonial/review)
3. Wait a few seconds for registration
4. Use `/decrypt` command
5. **IMPORTANT: Never delete your vouch or you will be permanently banned!**

## Features

✅ **Automatic Registration** - Vouches are registered instantly when posted
✅ **Real-time Monitoring** - System monitors vouch channel 24/7
✅ **Instant Ban** - Automatic permanent ban on vouch deletion
✅ **Comprehensive Logging** - All actions logged to log channel
✅ **Admin Bypass** - Admins don't need vouches
✅ **Persistent Storage** - Vouches stored in database
✅ **Detailed Tracking** - Tracks message ID, content, timestamps

## Security

- Vouch deletion triggers immediate ban
- No grace period or warnings
- Ban is permanent and automatic
- All actions are logged with full details
- System cannot be bypassed (except by admins)

## Technical Details

### Files Modified:
- `config.js` - Added vouchChannelId
- `index.js` - Added message monitoring
- `src/modules/handlers.js` - Added vouch check
- `src/modules/vouch-system.js` - Core vouch logic
- `src/database/vouches.json` - Vouch storage

### Required Intents:
- `GuildMessages` - To read vouch messages
- `MessageContent` - To access message content
- `GuildMembers` - To ban users

### Events Monitored:
- `MessageCreate` - Register new vouches
- `MessageDelete` - Detect vouch deletion and ban

## Troubleshooting

**User says they posted vouch but can't decrypt:**
- Check if message was posted in correct channel
- Verify bot has permission to read messages
- Check vouches.json database

**Ban not working:**
- Verify bot has BAN_MEMBERS permission
- Check bot role hierarchy (must be above user)
- Check logs for error messages

**Logs not appearing:**
- Verify logChannelId is set correctly
- Check bot has permission to send messages in log channel
- Ensure discordLogger is initialized

---

**System Status: ✅ Active and Monitoring**
