# 🚀 Complete Setup Guide - LeadLoop SaaS System

## Overview

This guide walks you through setting up the real AI-powered LeadLoop system with database persistence and optional WhatsApp integration.

---

## ✅ Phase 1: Environment Setup

### 1.1 Prerequisites

```bash
Node.js 18+
npm or yarn
SQLite (included with Prisma)
OpenAI/Groq account (for AI replies)
Meta Business Account (for WhatsApp - optional)
```

### 1.2 Install Dependencies

```bash
cd B2BSAAS
npm install
```

### 1.3 Configure Environment Variables

Copy the `.env.local` file and fill in your API keys:

```bash
# Database (auto-configured for SQLite)
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
# Generate secret: openssl rand -base64 32

# AI Provider (choose ONE)
AI_PROVIDER="openai"
OPENAI_API_KEY="sk-..."

# Or use Groq instead:
# AI_PROVIDER="groq"
# GROQ_API_KEY="gsk_..."

# WhatsApp (optional)
WHATSAPP_PHONE_ID="..."
WHATSAPP_BUSINESS_ACCOUNT_ID="..."
WHATSAPP_ACCESS_TOKEN="..."
WHATSAPP_WEBHOOK_TOKEN="your-random-token"
```

### 1.4 Setup Database

```bash
# Create/migrate database
npm run db:push

# (Optional) Seed with sample data
npm run db:seed

# View database in UI
npm run db:studio
```

---

## ✅ Phase 2: AI Integration Setup

### 2.1 Option A: OpenAI (Recommended)

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add to `.env.local`:

```env
AI_PROVIDER="openai"
OPENAI_API_KEY="sk-proj-..."
OPENAI_MODEL="gpt-3.5-turbo"  # or gpt-4, gpt-4-turbo
```

4. Test AI integration:

```bash
npm run dev
# Open browser to http://localhost:3000/dashboard
# Click "Generate Reply" button in chat
```

### 2.2 Option B: Groq (Free & Fast)

1. Go to https://console.groq.com/keys
2. Create a new API key
3. Add to `.env.local`:

```env
AI_PROVIDER="groq"
GROQ_API_KEY="gsk_..."
GROQ_MODEL="mixtral-8x7b-32768"
```

### 2.3 Test AI Integration

```bash
# 1. Start dev server
npm run dev

# 2. Navigate to http://localhost:3000/dashboard/chats

# 3. In any conversation, click the ⚡ (Zap) button

# 4. AI reply will be generated - you can edit and send
```

---

## ✅ Phase 3: WhatsApp Integration (Optional)

### 3.1 Get WhatsApp Cloud API Credentials

#### Step 1: Create Meta Business Account
1. Go to https://business.facebook.com
2. Create a new business account
3. Set up a WhatsApp Business Account

#### Step 2: Create WhatsApp App
1. Go to https://developers.facebook.com/apps
2. Create a new app
3. Select "Business" as app type
4. Add "WhatsApp" product

#### Step 3: Get Credentials
In your Meta app dashboard, find:
- **Business Phone ID**: Settings → WhatsApp → Phone Numbers
- **Business Account ID**: Settings → WhatsApp → Business Accounts
- **Access Token**: Settings → Users and Permissions (create system user or use own token)

#### Step 4: Configure Webhook
1. Go to WhatsApp Product → Configuration
2. Set Webhook URL to:
   ```
   https://yourdomain.com/api/webhooks/whatsapp
   ```
   (For local development, use ngrok: https://yourdomain-ngrok.io/api/webhooks/whatsapp)
3. Set Webhook Token to a random string:
   ```bash
   openssl rand -hex 16
   # Example output: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```

### 3.2 Configure in LeadLoop

```bash
# 1. Start dev server
npm run dev

# 2. Navigate to Settings or Dashboard

# 3. Go to Integrations → WhatsApp

# 4. Fill in your credentials:
WHATSAPP_PHONE_ID="120XXXXXXXXXXXXXXXXX"
WHATSAPP_BUSINESS_ACCOUNT_ID="XXXXXXXXXXXXXXXX"
WHATSAPP_ACCESS_TOKEN="EAAxxxxx..."
WHATSAPP_WEBHOOK_TOKEN="your-random-token"
```

### 3.3 Enable Auto-Reply

```bash
# Via API
curl -X POST http://localhost:3000/api/whatsapp/auto-reply \
  -H "Content-Type: application/json" \
  -d '{
    "workspaceId": "your-workspace-id",
    "enabled": true,
    "defaultText": "Thanks for messaging us! We will respond shortly."
  }'
```

### 3.4 Test WhatsApp Integration

1. Send a WhatsApp message to your business number
2. Message should appear in LeadLoop dashboard
3. Auto-reply should be sent if enabled
4. You can manually reply from the dashboard

---

## ✅ Phase 4: Real Chat System

### 4.1 How It Works

**Message Flow:**
```
User sends message
    ↓
Message stored in DB
    ↓
ChatUI displays in real-time
    ↓
AI can generate reply
    ↓
Reply sent via WhatsApp/API
```

### 4.2 Creating Conversations

**Manual:**
1. Go to Dashboard → Leads
2. Click on a lead
3. Click "Start Chat"

**Automatic (WhatsApp):**
- Messages received via WhatsApp automatically create conversations

### 4.3 Sending Messages

**From UI:**
```
1. Open conversation
2. Type message in input field
3. Press Enter or click Send button
4. Message stored + sent via WhatsApp (if configured)
```

**Via API:**
```bash
curl -X POST http://localhost:3000/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conv_xxx",
    "message": "Hi there!",
    "sendViaWhatsApp": true
  }'
```

---

## ✅ Phase 5: AI Reply System

### 5.1 How AI Replies Work

```
User sends message
    ↓
Click "Generate Reply" (⚡ button)
    ↓
AI service analyzes conversation context
    ↓
Generates professional business reply
    ↓
You can edit before sending
    ↓
Click "Send Reply"
    ↓
Reply stored + sent
```

### 5.2 Customizing AI Replies

**Edit `.env.local`:**
```env
# Model selection
OPENAI_MODEL="gpt-4"  # More powerful, slower, more expensive

# Or use default gpt-3.5-turbo (faster, cheaper)
```

**In code (lib/ai.ts):**
- Change `tone` parameter: "professional", "friendly", "formal"
- Change `maxTokens` for response length
- Modify system prompt for custom behavior

---

## ✅ Phase 6: Real Dashboard Buttons

All buttons now trigger real backend actions:

### Send Message
```typescript
onClick={handleSend} → sendMessage(conversationId, text)
→ DB insert + optional WhatsApp send
```

### Generate AI Reply
```typescript
onClick={handleGenerateAIReply}
→ POST /api/ai/reply
→ generateAIReply() with conversation context
→ Display preview for editing
```

### Send AI Reply
```typescript
onClick={handleSendAIReply}
→ saveAIReply(conversationId, text)
→ DB insert + optional WhatsApp send
```

---

## ✅ Phase 7: Database Schema

Key tables:
- **Conversation**: Chat threads between lead and company
- **ConversationMessage**: Individual messages with source tracking
- **WorkspaceSettings**: WhatsApp API credentials and auto-reply config
- **Lead**: Lead information with phone/email/company
- **User**: Team members

**Message Sources:**
- `MANUAL`: User typed in UI
- `WHATSAPP`: Received from WhatsApp
- `API`: Sent via API

**Sender Types:**
- `USER`: Human message
- `SYSTEM`: Auto-reply
- `AI`: AI-generated reply

---

## ✅ Phase 8: Testing

### 8.1 Manual Testing

```bash
# 1. Start dev server
npm run dev

# 2. Create account at http://localhost:3000/signup

# 3. Create workspace and lead

# 4. Open chat and send message
# Message should appear in DB

# 5. Click ⚡ to generate AI reply
# Wait 2-5 seconds for response

# 6. Edit and send reply
# Reply should appear in conversation
```

### 8.2 WhatsApp Testing

```bash
# 1. Use ngrok to expose local server
ngrok http 3000
# Copy forwarding URL

# 2. Update webhook URL in Meta dashboard
https://xxxxx-ngrok.io/api/webhooks/whatsapp

# 3. Send WhatsApp message to your business number

# 4. Check LeadLoop dashboard
# Message should appear in 10-30 seconds
```

### 8.3 Database Testing

```bash
# View all data
npm run db:studio

# Check messages table
SELECT * FROM ConversationMessage ORDER BY createdAt DESC LIMIT 10;

# Check WhatsApp configuration
SELECT * FROM WorkspaceSettings WHERE whatsappAccessToken IS NOT NULL;
```

---

## 🔧 Troubleshooting

### AI Reply Not Working
```
Check:
1. OPENAI_API_KEY or GROQ_API_KEY is set in .env.local
2. API key is valid and has available credits
3. Check browser console for errors
4. Check server logs: npm run dev

Example error handling:
- Missing API key → Error message shown in UI
- API rate limit → "Try again in a few seconds"
- Network error → "Connection failed, check your API key"
```

### WhatsApp Messages Not Appearing
```
Check:
1. Webhook token matches in .env.local
2. Webhook URL is correctly configured in Meta dashboard
3. Phone ID is correct
4. Access token is valid
5. Check ngrok is running (for local testing)

Debug:
npm run db:studio
→ WorkspaceSettings table
→ Verify whatsappAccessToken is set
→ Verify whatsappPhoneID matches
```

### Database Errors
```
Reset database:
1. Delete prisma/dev.db
2. Run: npm run db:push
3. Run: npm run db:seed (optional)
```

---

## 📊 Database Commands

```bash
# Apply schema changes
npm run db:push

# Seed sample data
npm run db:seed

# View database GUI
npm run db:studio

# Generate Prisma client
npx prisma generate

# Check schema
npx prisma validate
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# 1. Push to GitHub
git push

# 2. Connect to Vercel
vercel

# 3. Set environment variables in Vercel dashboard
# - NEXTAUTH_SECRET (new one)
# - NEXTAUTH_URL (your domain)
# - DATABASE_URL (use Vercel Postgres)
# - OPENAI_API_KEY
# - WHATSAPP_* (if using)

# 4. Deploy
vercel --prod
```

### Docker

```bash
docker build -t leadloop .
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=sk-... \
  -e DATABASE_URL=file:./prisma/prod.db \
  leadloop
```

---

## 📚 API Reference

### AI Endpoint
```
POST /api/ai/reply
{
  "conversationId": "string",
  "userMessage": "string",
  "tone": "professional|friendly|formal"
}

Response:
{
  "success": true,
  "reply": "AI-generated response",
  "provider": "openai|groq"
}
```

### WhatsApp Send
```
POST /api/whatsapp/send
{
  "conversationId": "string",
  "message": "string",
  "sendViaWhatsApp": boolean
}

Response:
{
  "success": true,
  "messageId": "string"
}
```

### WhatsApp Configure
```
POST /api/whatsapp/configure
{
  "workspaceId": "string",
  "phoneNumberId": "string",
  "businessAccountId": "string",
  "accessToken": "string",
  "webhookToken": "string"
}
```

### Auto-Reply Settings
```
GET /api/whatsapp/auto-reply?workspaceId=...
POST /api/whatsapp/auto-reply
{
  "workspaceId": "string",
  "enabled": boolean,
  "defaultText": "string"
}
```

---

## 🎯 Next Steps

1. **Choose AI Provider**: OpenAI or Groq
2. **Get API Keys**: Set up account and generate keys
3. **Configure .env.local**: Add all credentials
4. **Test Locally**: npm run dev and test all features
5. **Optional: Set up WhatsApp**: Follow WhatsApp section
6. **Deploy**: Follow deployment section
7. **Monitor**: Check logs and error rates

---

## 📞 Support

- **OpenAI Help**: https://platform.openai.com/docs
- **Groq Help**: https://groq.com/docs
- **WhatsApp Cloud API**: https://developers.facebook.com/docs/whatsapp
- **Prisma ORM**: https://www.prisma.io/docs

---

**Ready to launch your real SaaS? Start with AI setup and test locally first!** 🚀
