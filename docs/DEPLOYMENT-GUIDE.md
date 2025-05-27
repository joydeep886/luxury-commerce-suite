
# Deployment Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for caching)
- Domain name with SSL certificate

## Environment Setup

### Backend Environment Variables
Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/luxuria

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Email (NodeMailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Redis (for caching)
REDIS_URL=redis://localhost:6379

# App
NODE_ENV=production
PORT=5000
```

## Database Setup

### 1. Create Database
```sql
CREATE DATABASE luxuria;
CREATE USER luxuria_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE luxuria TO luxuria_user;
```

### 2. Run Migrations
```bash
cd backend
npm install
npm run build
npm run migrate
```

### 3. Seed Database
```bash
npm run seed
```

## Backend Deployment

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Build Application
```bash
npm run build
```

### 3. Start Production Server
```bash
npm start
```

### 4. Process Manager (PM2)
```bash
npm install -g pm2
pm2 start dist/server.js --name "luxuria-api"
pm2 startup
pm2 save
```

## Frontend Deployment

### 1. Build Frontend
```bash
cd frontend
npm install
npm run build
```

### 2. Serve Static Files
Use nginx, Apache, or any static file server to serve the `dist` folder.

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Docker Deployment (Optional)

### Backend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: luxuria
      POSTGRES_USER: luxuria_user
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://luxuria_user:your_password@postgres:5432/luxuria
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

## SSL Certificate Setup

### Using Let's Encrypt (Certbot)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Monitoring & Logging

### 1. Application Logs
```bash
pm2 logs luxuria-api
```

### 2. System Monitoring
Consider using:
- **Uptime monitoring**: Pingdom, UptimeRobot
- **Error tracking**: Sentry
- **Performance monitoring**: New Relic, DataDog

## Backup Strategy

### Database Backups
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U luxuria_user luxuria > backup_$DATE.sql
```

### File Backups
- Backup uploaded images regularly
- Store backups in cloud storage (AWS S3, Google Cloud)

## Security Checklist

- [ ] Environment variables are secure
- [ ] Database connections are encrypted
- [ ] SSL certificate is installed
- [ ] Rate limiting is configured
- [ ] Input validation is implemented
- [ ] CORS is properly configured
- [ ] Security headers are set (Helmet.js)
- [ ] Regular security updates
- [ ] Database backups are automated
- [ ] Access logs are monitored

## Performance Optimization

### Frontend
- [ ] Code splitting is implemented
- [ ] Images are optimized
- [ ] CDN is configured
- [ ] Gzip compression is enabled
- [ ] Browser caching is configured

### Backend
- [ ] Database queries are optimized
- [ ] API responses are cached
- [ ] Connection pooling is configured
- [ ] Rate limiting is implemented
- [ ] Static files are served efficiently

## Troubleshooting

### Common Issues
1. **Database connection errors**: Check DATABASE_URL and credentials
2. **CORS issues**: Verify CORS configuration
3. **JWT errors**: Ensure JWT_SECRET is set correctly
4. **File upload issues**: Check Cloudinary configuration
5. **Payment errors**: Verify Stripe keys and webhook configuration
