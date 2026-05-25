# ⚡ QUICK START - 5 MINUTE SETUP

## Overview
Transform your LeadLoop SaaS from fake to **REAL** in 5 minutes.

---

## Step 1: Get API Keys (2 min)

### Option A: OpenAI (Recommended)
```
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with sk-)
4. Save it - you'll need it in Step 2
```

### Option B: Groq (Free & Fast)
```
1. Go to https://console.groq.com/keys
2. Create new API key
3. Copy the key (starts with gsk_)
```

---

## Step 2: Configure Environment (2 min)

```bash
# Open .env.local in your editor
# Find these lines and fill in your API key:

AI_PROVIDER="openai"
OPENAI_API_KEY="sk-YOUR-KEY-HERE"

# Save the file
```

---

## Step 3: Setup Database (1 min)

```bash
# In terminal:
npm run db:push

# Wait for completion
```

---

## Step 4: Start & Test (1 min)

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: View database (optional)
npm run db:studio
```

Open: http://localhost:3000/dashboard/chats

---

## Test AI Integration

1. **Create a conversation** (if needed)
2. **Type a message** in the input field
3. **Press Enter** to send
4. **Click ⚡ (Zap)** button
5. **Wait 2-5 seconds** for AI reply
6. **Edit if needed**
7. **Click "Send Reply"**

✅ **That's it! You now have REAL AI-powered replies!**

---

## Optional: WhatsApp Integration (5 min)

### Get WhatsApp Credentials
```
1. Go to https://business.facebook.com
2. Create Business Account (if not already done)
3. Create WhatsApp Business App
4. Go to https://developers.facebook.com/apps
5. Find your app → WhatsApp → Configuration
6. Note these values:
   - Business Phone ID
   - Business Account ID
   - Access Token
```

### Configure WhatsApp
```bash
# In .env.local, fill in:
WHATSAPP_PHONE_ID="120XXXXXXXX"
WHATSAPP_BUSINESS_ACCOUNT_ID="XXXXXXXXX"
WHATSAPP_ACCESS_TOKEN="EAAxxxxx..."
WHATSAPP_WEBHOOK_TOKEN="your-random-token"
# Generate random token: openssl rand -hex 16

# Save file and restart:
npm run dev
```

### Verify Webhook
```
1. In Meta Dashboard
2. Go to WhatsApp Product → Configuration
3. Set Webhook URL to:
   https://yourdomain.com/api/webhooks/whatsapp
4. Set Webhook Token to: WHATSAPP_WEBHOOK_TOKEN value
5. Click Save

For local testing, use ngrok:
ngrok http 3000
# Then use: https://xxxxx-ngrok.io/api/webhooks/whatsapp
```

---

## ✅ What's Now Real

| Feature | Before | After |
|---------|--------|-------|
| AI Replies | Fake | ✅ Real API (OpenAI/Groq) |
| Chat Messages | Demo data | ✅ Real database |
| Message Storage | Simulated | ✅ SQLite with Prisma |
| WhatsApp | Not included | ✅ Full integration |
| Auto-Reply | Not included | ✅ AI-powered |
| Buttons | Mock actions | ✅ Real backend |

---

## 🔧 Troubleshooting

### "Invalid API key"
- Check OPENAI_API_KEY in .env.local
- Verify key has not been revoked
- Make sure key is prefixed with "sk-"

### "AI reply not working"
- Check API key is valid
- Check internet connection
- Look at browser console for errors
- Check server logs: npm run dev output

### "Messages not saving"
- Check DATABASE_URL in .env.local
- Run: npm run db:push
- Delete prisma/dev.db and retry

### "WhatsApp not receiving messages"
- Check webhook URL is correct in Meta dashboard
- Check webhook token matches WHATSAPP_WEBHOOK_TOKEN
- Use ngrok for local testing (not localhost)

---

## 📚 Learn More

- **Full Setup Guide**: See `INTEGRATION_SETUP_GUIDE.md`
- **Implementation Details**: See `REAL_SYSTEM_IMPLEMENTATION.md`
- **API Reference**: See `INTEGRATION_SETUP_GUIDE.md` → API Reference section

---

## 🚀 You're Ready!

Your SaaS now has:
✅ Real AI-powered replies  
✅ Real database persistence  
✅ Real WhatsApp integration (optional)  
✅ Production-ready architecture  

**Start testing now!** 🎉

Next: Deploy to Vercel when ready!
