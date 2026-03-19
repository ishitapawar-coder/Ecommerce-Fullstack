# ShopSmart Deployment Guide

This guide covers deploying the ShopSmart e-commerce application to production environments.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- PM2 (for process management)
- Nginx (for reverse proxy)
- SSL certificate (for HTTPS)

## Environment Setup

### 1. Production Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/shopsmart_prod

# Server
PORT=5002
NODE_ENV=production

# JWT
JWT_SECRET=your_super_secure_jwt_secret_here

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Frontend Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Backend Deployment

### 1. Install Dependencies

```bash
cd shopsmart/backend
npm install --production
```

### 2. Build the Application

```bash
npm run build
```

### 3. Set up PM2

Install PM2 globally:
```bash
npm install -g pm2
```

Create a PM2 ecosystem file (`ecosystem.config.js`):
```javascript
module.exports = {
  apps: [{
    name: 'shopsmart-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5002
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### 4. Start the Application

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Set up Nginx Reverse Proxy

Create an Nginx configuration file (`/etc/nginx/sites-available/shopsmart-api`):

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/shopsmart-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Frontend Deployment

### 1. Install Dependencies

```bash
cd shopsmart/frontend
npm install
```

### 2. Build for Production

```bash
npm run build
```

### 3. Deploy to Web Server

Copy the `dist` folder to your web server directory:

```bash
sudo cp -r dist/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html/
```

### 4. Set up Nginx for Frontend

Create an Nginx configuration file (`/etc/nginx/sites-available/shopsmart-frontend`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/html;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/shopsmart-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL Configuration

### 1. Install Certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### 2. Obtain SSL Certificates

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com
```

### 3. Auto-renewal

```bash
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

## Database Setup

### 1. Install MongoDB

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 2. Secure MongoDB

Edit `/etc/mongodb.conf`:
```yaml
security:
  authorization: enabled
```

Create admin user:
```javascript
use admin
db.createUser({
  user: "admin",
  pwd: "secure_password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})
```

### 3. Populate Database

```bash
cd shopsmart/backend
node scripts/populateProducts.js
```

## Monitoring and Logging

### 1. PM2 Monitoring

```bash
pm2 monit
pm2 logs
```

### 2. Nginx Logs

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 3. Application Logs

```bash
pm2 logs shopsmart-backend
```

## Backup Strategy

### 1. Database Backup

Create a backup script (`backup.sh`):
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
mkdir -p $BACKUP_DIR

mongodump --db shopsmart_prod --out $BACKUP_DIR/backup_$DATE
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/backup_$DATE
rm -rf $BACKUP_DIR/backup_$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
```

Make it executable and add to crontab:
```bash
chmod +x backup.sh
crontab -e
# Add this line for daily backups at 2 AM:
0 2 * * * /path/to/backup.sh
```

### 2. Application Backup

```bash
# Backup application files
tar -czf /backups/app/shopsmart_$(date +%Y%m%d).tar.gz /var/www/html/
```

## Security Considerations

### 1. Firewall Configuration

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Regular Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Update Node.js dependencies
npm audit fix
```

### 3. Environment Security

- Use strong, unique passwords
- Rotate JWT secrets regularly
- Keep API keys secure
- Monitor access logs

## Troubleshooting

### Common Issues

1. **PM2 Process Not Starting**
   ```bash
   pm2 logs
   pm2 restart shopsmart-backend
   ```

2. **Nginx Configuration Errors**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

3. **MongoDB Connection Issues**
   ```bash
   sudo systemctl status mongodb
   mongo --eval "db.adminCommand('ping')"
   ```

4. **SSL Certificate Issues**
   ```bash
   sudo certbot certificates
   sudo certbot renew --dry-run
   ```

### Performance Optimization

1. **Enable Gzip Compression**
   Add to Nginx config:
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   ```

2. **Database Indexing**
   ```javascript
   // Create indexes for better performance
   db.products.createIndex({ "category": 1 });
   db.carts.createIndex({ "user": 1 });
   ```

3. **Caching**
   - Implement Redis for session storage
   - Use CDN for static assets
   - Enable browser caching

## Maintenance

### Regular Tasks

1. **Daily**
   - Check application logs
   - Monitor system resources
   - Verify backups

2. **Weekly**
   - Update dependencies
   - Review security logs
   - Performance monitoring

3. **Monthly**
   - SSL certificate renewal check
   - Database optimization
   - Security audit

## Support

For deployment issues:
- Check application logs
- Review system resources
- Contact the development team
- Refer to troubleshooting section
