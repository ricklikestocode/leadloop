# Deployment Guide - ReplyFlow AI Phase 2

## Production Deployment Checklist

### 1. Pre-Deployment

#### Code Quality
- [ ] Run linter: `npm run lint`
- [ ] Run tests: `npm test` (if configured)
- [ ] Review TypeScript errors: `npx tsc --noEmit`
- [ ] Verify no console.log() statements left in production code

#### Database
- [ ] Backup production database
- [ ] Test migrations locally first
- [ ] Verify schema matches Prisma
- [ ] Check for breaking changes

#### Security
- [ ] Generate new NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Update all environment variables
- [ ] Review .env.local is in .gitignore
- [ ] Verify no secrets in codebase
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set security headers

#### Performance
- [ ] Build and measure: `npm run build`
- [ ] Check build size
- [ ] Verify images are optimized
- [ ] Test API response times
- [ ] Load test critical endpoints

### 2. Vercel Deployment

#### Initial Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to staging
vercel --prod --env-file .env.local
```

#### Environment Variables
Set in Vercel Dashboard → Settings → Environment Variables:
```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key
```

#### Database Connection
```bash
# Connect to production database from Vercel
# Use connection pooling mode if available
DATABASE_URL="postgresql://user:password@host:port/db?schema=public"
```

#### Deploy
```bash
# Deploy to production
npm run build
vercel --prod
```

### 3. Heroku Deployment (Alternative)

#### Create App
```bash
heroku create your-app-name
```

#### Set Environment Variables
```bash
heroku config:set DATABASE_URL="postgresql://..."
heroku config:set NEXTAUTH_SECRET="..."
heroku config:set NEXTAUTH_URL="https://your-app-name.herokuapp.com"
```

#### Deploy
```bash
git push heroku main
heroku run npx prisma db push
```

### 4. Self-Hosted Deployment (AWS/DigitalOcean)

#### Prerequisites
- Server with Node.js 18+
- PostgreSQL 14+
- Nginx or similar reverse proxy
- SSL certificate (Let's Encrypt)

#### Installation
```bash
# SSH into server
ssh user@server-ip

# Clone repository
git clone your-repo-url
cd your-app

# Install dependencies
npm ci --only=production

# Setup environment
cp .env.example .env
# Edit .env with production values
```

#### Database Setup
```bash
# Create PostgreSQL database
createdb leadloop-prod

# Run migrations
npx prisma db push --skip-generate
```

#### Start Application
```bash
# Build
npm run build

# Start with PM2
npm i -g pm2
pm2 start "npm start" --name "leadloop"
pm2 save
pm2 startup
```

#### Configure Nginx
```nginx
upstream leadloop {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://leadloop;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL with Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 5. Docker Deployment

#### Build Docker Image
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "start"]
```

#### Build and Run
```bash
docker build -t leadloop .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  leadloop
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: leadloop
      POSTGRES_PASSWORD: your-password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:your-password@db:5432/leadloop
      NEXTAUTH_SECRET: your-secret
      NEXTAUTH_URL: http://localhost:3000
    depends_on:
      - db

volumes:
  postgres_data:
```

Run with: `docker-compose up`

### 6. Post-Deployment

#### Verification
- [ ] Test login flow
- [ ] Create test lead
- [ ] Invite test user
- [ ] Check analytics loading
- [ ] Verify notifications work
- [ ] Test file uploads
- [ ] Check error logging

#### Monitoring
- [ ] Setup error tracking (Sentry)
- [ ] Monitor database performance
- [ ] Track API response times
- [ ] Setup uptime monitoring
- [ ] Configure alerts

#### Backups
- [ ] Setup daily database backups
- [ ] Test restore process
- [ ] Document backup location
- [ ] Setup backup alerts

#### Logging
- [ ] Enable application logs
- [ ] Configure log rotation
- [ ] Setup centralized logging (if needed)
- [ ] Archive logs

### 7. Performance Optimization

#### Database
```sql
-- Create indexes for frequently queried fields
CREATE INDEX idx_lead_workspace ON lead(workspace_id);
CREATE INDEX idx_conversation_workspace ON conversation(workspace_id);
CREATE INDEX idx_notification_user ON notification(user_id, read);
```

#### Caching
```typescript
// Add Redis caching layer
import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL);

// Cache analytics
export async function getCachedAnalytics(workspaceId: string) {
  const cached = await redis.get(`analytics:${workspaceId}`);
  if (cached) return JSON.parse(cached);
  
  const data = await getWorkspaceAnalytics(workspaceId);
  await redis.setex(`analytics:${workspaceId}`, 3600, JSON.stringify(data));
  return data;
}
```

#### CDN
- Configure CDN for static assets
- Set cache headers appropriately
- Optimize images

### 8. Security Hardening

#### Headers
```typescript
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
};
```

#### Rate Limiting
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
});

export async function middleware(request: NextRequest) {
  const { success } = await ratelimit.limit(request.ip || 'unknown');
  return success ? NextResponse.next() : NextResponse.json({ error: 'Too many requests' }, { status: 429 });
}
```

#### CORS
```typescript
// next.config.js
module.exports = {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
};
```

### 9. Scaling Considerations

#### Database Scaling
- Setup read replicas for analytics queries
- Use connection pooling
- Implement query optimization
- Consider database sharding if needed

#### Application Scaling
- Deploy multiple instances
- Use load balancer
- Implement session storage (Redis)
- Optimize startup time

#### Real-Time Scaling
- Setup Socket.io adapter for distributed systems
- Use Redis for pub/sub
- Implement proper connection management

### 10. Maintenance & Monitoring

#### Regular Tasks
- [ ] Review logs daily
- [ ] Monitor error rates
- [ ] Check database size
- [ ] Update dependencies monthly
- [ ] Test backup recovery quarterly

#### Health Checks
```typescript
// api/health.ts
export async function GET() {
  try {
    await db.user.count(); // Database check
    return Response.json({ status: 'ok' });
  } catch (error) {
    return Response.json({ status: 'error' }, { status: 500 });
  }
}
```

#### Automated Monitoring
```typescript
// Background job every 24 hours
export async function recordDailyAnalytics() {
  const workspaces = await db.workspace.findMany();
  for (const workspace of workspaces) {
    await recordDailyAnalytics(workspace.id);
  }
}
```

### 11. Rollback Plan

If deployment goes wrong:
```bash
# Revert to previous version
git revert HEAD
npm run build
git push prod main

# Revert database (if needed)
npx prisma migrate resolve --rolled-back migration_name
```

### 12. Team Communication

Notify team:
- [ ] Deployment start time
- [ ] Expected downtime (if any)
- [ ] Features deployed
- [ ] Who to contact for issues
- [ ] Deployment completion

---

## Troubleshooting

### Database Connection Error
```bash
# Verify connection string
psql $DATABASE_URL -c "SELECT version();"

# Check network connectivity
ping your-db-host
```

### Build Fails
```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Memory Issues
```bash
# Increase Node memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm start
```

---

## Support

For issues:
- Check error logs
- Review Sentry dashboard
- Check database with `npx prisma studio`
- Verify environment variables

**Last Updated**: 2024
