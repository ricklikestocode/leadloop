# LeadLoop - Deployment Guide

Complete guide to deploying LeadLoop to production on Vercel with PostgreSQL.

## ⚡ Quick Deploy (5 minutes)

### Prerequisites
- GitHub account with your LeadLoop repository
- Vercel account (free at vercel.com)
- PostgreSQL database (we'll set this up)

### Step 1: Set Up Production Database

**Option A: Vercel Postgres (Recommended)**
1. Go to https://vercel.com/storage/postgres
2. Click "Create Postgres Database"
3. Name it `leadloop`
4. Select your region (closest to users)
5. Copy the `POSTGRES_CONNECTION_STRING`

**Option B: Supabase (Free tier works great)**
1. Go to https://supabase.com
2. Create new project
3. Go to Project Settings → Database
4. Copy "Connection string" (with password)
5. Format: `postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require`

**Option C: Railway**
1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL
4. Copy connection string from Variables

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Deploy LeadLoop to production"
git push origin main
```

### Step 3: Connect Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"

### Step 4: Configure Environment Variables

In Vercel dashboard:

1. Go to your project settings
2. Click "Environment Variables"
3. Add these variables:

| Key | Value | Example |
|-----|-------|---------|
| `DATABASE_URL` | Your PostgreSQL connection string | `postgresql://...` |
| `NEXTAUTH_URL` | Your production domain | `https://yourdomain.com` |
| `NEXTAUTH_SECRET` | Generate new with: `openssl rand -base64 32` | Random 43+ character string |

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
# Copy output and paste in Vercel
```

### Step 5: Deploy

Click "Deploy" button in Vercel dashboard.

**Wait 2-3 minutes...**

You'll see a ✓ when deployment completes.

### Step 6: Initialize Database

1. Go to your deployed URL
2. Visit: `https://your-domain.vercel.app/api/auth/signin`
3. If you see an error about database, your DATABASE_URL isn't set correctly

**Fix database errors:**
```bash
# If DATABASE_URL fails, check:
# 1. Connection string is copied exactly
# 2. No spaces at start/end
# 3. Password doesn't have special chars that need escaping
```

**Manually seed the database:**

Option 1: Use Prisma CLI
```bash
# From your local machine with Vercel environment
npx prisma@latest db:push --skip-generate

# Then seed
npm run db:seed
```

Option 2: Use Vercel CLI
```bash
npm install -g vercel
vercel env pull  # Download env variables
npm run db:push
npm run db:seed
```

### Step 7: Test Production

1. Visit your deployment URL
2. Sign up with new account
3. Create test lead
4. Verify everything works

## 🔒 Security Checklist

Before going live:

- [ ] NEXTAUTH_SECRET is set and different from development
- [ ] DATABASE_URL uses production database
- [ ] NEXTAUTH_URL matches your domain
- [ ] No `.env.local` in git (check `.gitignore`)
- [ ] Updated landing page marketing copy
- [ ] Logo updated (if different from demo)
- [ ] Domain is configured in DNS
- [ ] SSL certificate is active (automatic with Vercel)

## 📊 Production Database Costs

### Vercel Postgres
- Free tier: 60 hours/month
- Starter: $19/month → unlimited usage
- Good for: Most small businesses

### Supabase
- Free tier: 500 MB storage, 1 GB bandwidth/month
- Pro: $25/month
- Good for: Starting free, scale up

### Railway
- Pay-as-you-go: $5 free credits/month
- PostgreSQL: ~$10/month for small instance
- Good for: Predictable usage

## 🚀 Going Live with Custom Domain

### Step 1: Point Domain to Vercel

For domain registrar (GoDaddy, Namecheap, etc.):

**Method A: CNAME (Recommended)**
1. Create CNAME record:
   - Name: `www`
   - Value: `cname.vercel.sh`
2. Create A record:
   - Name: `@`
   - Value: `76.76.19.89`

**Method B: Nameserver**
1. Update nameservers to Vercel's:
   - `ns1.vercel.sh`
   - `ns2.vercel.sh`
   - `ns3.vercel.sh`
   - `ns4.vercel.sh`

### Step 2: Configure in Vercel

1. Project Settings → Domains
2. Add your domain
3. Wait 24 hours for DNS propagation
4. Update `NEXTAUTH_URL` in environment variables

### Step 3: Test SSL

Visit: https://your-domain.com

You should see a padlock 🔒 (SSL is automatic).

## 📈 Scaling Tips

### As you grow:

**Performance:**
- Enable Image Optimization
- Use Vercel Analytics (track metrics)
- Monitor database query performance

**Database:**
- Scale to Pro tier if needed
- Monitor connections and storage
- Consider read replicas for heavy reads

**Features to Add:**
- Email notifications (SendGrid, Resend)
- SMS reminders (Twilio)
- Slack integration
- API for third-party tools
- Advanced reporting

## 🔍 Monitoring Production

### Enable Vercel Analytics
1. Project Settings → Analytics
2. Check insights
3. Monitor function execution time
4. Track Core Web Vitals

### Database Monitoring
1. Check PostgreSQL query logs
2. Monitor connection pool usage
3. Set up alerts for high CPU/memory

## 🆘 Troubleshooting Production

### "502 Bad Gateway" error
- Check DATABASE_URL is correct
- Ensure database is accessible
- Check Vercel function logs

### Slow page loads
- Check database queries
- Enable Next.js caching
- Use Vercel Edge Network

### Database connection errors
- Verify IP whitelist (if applicable)
- Check connection string format
- Test locally first

### "NEXTAUTH_SECRET not set"
- Add NEXTAUTH_SECRET to Vercel environment variables
- Click Redeploy after adding

### Users can't sign up
- Check email/password validation
- Verify database has users table
- Check API route response

## 📱 Setting Up Mobile Access

### Test on different devices

1. Get your Vercel URL
2. Visit on phone/tablet
3. Test responsive design
4. Test forms and interactions

### Track mobile performance

Monitor in Vercel Analytics:
- Mobile Core Web Vitals
- Mobile page load time
- Mobile bounce rate

## 🔐 Production Security

### Additional Recommendations

```env
# Set stricter CSP headers
# Update security headers
# Enable rate limiting (middleware)
# Add IP whitelist for admin (optional)
```

### Monitor for issues

- [ ] Set up error tracking (Sentry)
- [ ] Monitor database backups
- [ ] Test disaster recovery
- [ ] Set up automated backups

## 📞 Support

### Getting Help

1. Check Vercel docs: https://vercel.com/docs
2. Check Prisma docs: https://www.prisma.io/docs/
3. Check Next.js docs: https://nextjs.org/docs

### Common Issues

**Prisma Migration Failed:**
```bash
# Rebuild from scratch
npm run db:push --force
npm run db:seed
```

**Build Timeout:**
- This rarely happens with Vercel
- Usually means database operation is slow
- Optimize queries or upgrade database tier

## 📊 Estimated Costs (Monthly)

| Service | Free | Starter | Notes |
|---------|------|---------|-------|
| Vercel Hosting | Free | - | Up to 100GB bandwidth |
| Postgres (Vercel) | $19 (after trial) | - | If using Vercel Postgres |
| Postgres (Supabase) | Free (500MB) | $25 | Includes backup, replication |
| Total | $0-19/month | $25+/month | Depends on choices |

## 🎉 You're Live!

Your LeadLoop instance is now:
- ✅ Globally accessible
- ✅ Secure with SSL
- ✅ Automatically backed up (Vercel)
- ✅ Auto-scaling
- ✅ Production-grade

## Next Steps

1. **Invite team members:**
   - Have them sign up at your domain
   - Create test leads
   - Get feedback

2. **Set up monitoring:**
   - Vercel Analytics
   - Database monitoring
   - Error tracking

3. **Plan growth:**
   - Upgrade database if needed
   - Add team features
   - Implement notifications

4. **Optimize:**
   - Monitor performance
   - Improve based on usage
   - Add features based on feedback

---

**Your LeadLoop is production-ready!** 🚀

Questions? Check the README.md or main SETUP_GUIDE.md
