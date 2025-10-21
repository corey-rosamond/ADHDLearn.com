#!/bin/bash
###############################################################################
# Aurora's Reading Adventure - Deployment Script
# Server: 160.153.180.159
# User: corey
# Target: /var/www/readingadventure.adhdlearn.com
# Domain: readingadventure.adhdlearn.com
###############################################################################

# Configuration
SERVER_USER="corey"
SERVER_HOST="160.153.180.159"
REMOTE_PATH="/var/www/readingadventure.adhdlearn.com"
LOCAL_PATH="."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Aurora's Reading Adventure - Deployment      ║${NC}"
echo -e "${BLUE}║  Target: ${SERVER_HOST}                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check if we can connect to server
echo -e "${YELLOW}🔌 Testing connection to server...${NC}"
if ! ssh -o ConnectTimeout=5 ${SERVER_USER}@${SERVER_HOST} "echo 'Connected'" &>/dev/null; then
    echo -e "${RED}❌ Cannot connect to ${SERVER_HOST}${NC}"
    echo -e "${YELLOW}💡 Make sure:${NC}"
    echo "   - Server is running"
    echo "   - SSH key is set up (or password is ready)"
    echo "   - IP address is correct: ${SERVER_HOST}"
    exit 1
fi
echo -e "${GREEN}✅ Connection successful${NC}"
echo ""

# Create remote directory if it doesn't exist
echo -e "${YELLOW}📁 Creating remote directory...${NC}"
ssh ${SERVER_USER}@${SERVER_HOST} "sudo mkdir -p ${REMOTE_PATH}"
echo -e "${GREEN}✅ Remote directory ready${NC}"
echo ""

# Upload files via rsync
echo -e "${YELLOW}📦 Uploading files to server...${NC}"
rsync -avz --progress --delete \
  --exclude '.git/' \
  --exclude '.git*' \
  --exclude 'node_modules/' \
  --exclude '.ai/' \
  --exclude 'android/' \
  --exclude 'deploy.sh' \
  --exclude 'server-setup.sh' \
  --exclude 'apache-config.conf' \
  --exclude 'https-server.py' \
  --exclude 'cert.pem' \
  --exclude 'key.pem' \
  --exclude '*.md' \
  --exclude 'README.md' \
  --exclude 'scripts/generate-*.js' \
  --exclude 'scripts/ICON-GENERATOR-README.md' \
  --exclude '.nojekyll' \
  ${LOCAL_PATH}/ ${SERVER_USER}@${SERVER_HOST}:${REMOTE_PATH}/

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ File upload failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Files uploaded successfully${NC}"
echo ""

# Set correct permissions on server
echo -e "${YELLOW}🔒 Setting file permissions...${NC}"
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
# Set ownership (corey owns, www-data can read)
sudo chown -R corey:www-data /var/www/readingadventure.adhdlearn.com

# Directories: 755 (rwxr-xr-x) - owner can write, others can read/execute
sudo find /var/www/readingadventure.adhdlearn.com -type d -exec chmod 755 {} \;

# Files: 644 (rw-r--r--) - owner can write, others can read
sudo find /var/www/readingadventure.adhdlearn.com -type f -exec chmod 644 {} \;

echo "Permissions set: corey:www-data, dirs=755, files=644"
ENDSSH

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Permission setting failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Permissions configured${NC}"
echo ""

# Check Apache status
echo -e "${YELLOW}🌐 Checking Apache status...${NC}"
ssh ${SERVER_USER}@${SERVER_HOST} "sudo systemctl status apache2 --no-pager | grep -i active" || true
echo ""

echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           Deployment Complete! ✅              ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📍 Files deployed to:${NC} ${REMOTE_PATH}"
echo -e "${BLUE}🌐 Domain:${NC} http://readingadventure.adhdlearn.com"
echo -e "${BLUE}🌐 Server IP:${NC} http://${SERVER_HOST}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Install SSL certificate: sudo certbot --apache -d readingadventure.adhdlearn.com"
echo "2. Test the game in browser: http://readingadventure.adhdlearn.com"
echo ""
echo -e "${YELLOW}View logs:${NC}"
echo "  ssh ${SERVER_USER}@${SERVER_HOST}"
echo "  sudo tail -f /var/log/apache2/readingadventure.adhdlearn.com_error.log"
echo ""
