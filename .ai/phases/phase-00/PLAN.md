# Phase 0: Server Infrastructure

**Project:** ADHDLearn.com
**Phase:** 0 of 36
**Last Updated:** October 22, 2025

---

## Overview

**Delivers:** Production and staging environments ready for deployment
**Aurora gets:** Nothing yet
**You get:** Infrastructure to deploy to
**Deployed:** Placeholder pages at all 8 domains

### What This Phase Delivers

Complete server infrastructure configured and ready:

- 8 Apache virtual hosts (production + staging for each subdomain)
- SSL certificates via Let's Encrypt
- Git deployment hooks
- Firewall configuration
- PM2 process manager installed
- Placeholder HTML pages confirming setup

### Database Changes

None (database setup happens in Phase 3)

### API Endpoints

None (API setup happens in Phase 3)

### Frontend Changes

**New Files:**

- `/var/www/adhdlearn.com/production/child/index.html` - Placeholder
- `/var/www/adhdlearn.com/production/parent/index.html` - Placeholder
- `/var/www/adhdlearn.com/production/www/index.html` - Placeholder
- Corresponding staging files

### Technical Specifications

#### Apache Virtual Host Configuration

**Production Child Portal:** `/etc/apache2/sites-available/child.adhdlearn.com.conf`

```apache
<VirtualHost *:80>
    ServerName child.adhdlearn.com
    ServerAdmin admin@adhdlearn.com
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName child.adhdlearn.com
    ServerAdmin admin@adhdlearn.com
    DocumentRoot /var/www/adhdlearn.com/production/child

    <Directory /var/www/adhdlearn.com/production/child>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/child.adhdlearn.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/child.adhdlearn.com/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf

    ErrorLog ${APACHE_LOG_DIR}/child.adhdlearn.com-error.log
    CustomLog ${APACHE_LOG_DIR}/child.adhdlearn.com-access.log combined
</VirtualHost>
```

Repeat similar configurations for:

- `parent.adhdlearn.com`
- `adhdlearn.com`
- `api.adhdlearn.com` (reverse proxy to localhost:3000)
- All 4 staging equivalents

#### SSL Certificate Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache -y

# Generate certificates for all domains
sudo certbot --apache -d adhdlearn.com -d www.adhdlearn.com
sudo certbot --apache -d parent.adhdlearn.com
sudo certbot --apache -d child.adhdlearn.com
sudo certbot --apache -d api.adhdlearn.com
sudo certbot --apache -d staging.adhdlearn.com
sudo certbot --apache -d staging-parent.adhdlearn.com
sudo certbot --apache -d staging-child.adhdlearn.com
sudo certbot --apache -d staging-api.adhdlearn.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

#### Firewall Configuration

```bash
sudo apt install ufw -y
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

#### PM2 Installation

```bash
# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Configure PM2 startup
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
```

### Acceptance Criteria

- [ ] All 8 domains resolve to server IP
- [ ] All domains redirect HTTP → HTTPS
- [ ] SSL certificates valid (no browser warnings)
- [ ] Placeholder pages load successfully
- [ ] Security headers present in responses
- [ ] Firewall active (only ports 22, 80, 443 open)
- [ ] PM2 installed and configured for startup

### McCabe Complexity

N/A (infrastructure only)

### Dependencies

None (Phase 0 is the foundation)

---
