#!/bin/bash
###############################################################################
# Child Portal - Deploy to Staging
# Builds child-portal and deploys to child-staging.adhdlearn.com
###############################################################################

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Child Portal Deployment to Staging ===${NC}"
echo ""

# Build child portal
echo -e "${YELLOW}📦 Building child-portal...${NC}"
cd /home/corey/Desktop/ADHDLearn.com/child-portal
npm run build
echo -e "${GREEN}✅ Build complete${NC}"
echo ""

# Deploy via SSH
echo -e "${YELLOW}🚀 Deploying to staging server...${NC}"
DEPLOY_DIR="/var/www/adhdlearn.com/staging/child"

# Create tarball
cd dist
tar czf /tmp/child-staging-deploy.tar.gz .
echo -e "${GREEN}✅ Created deployment archive${NC}"

# Copy to server and extract
sshpass -p '81naryS0lut10ns!' scp -o StrictHostKeyChecking=no \
  /tmp/child-staging-deploy.tar.gz corey@160.153.180.159:/tmp/

sshpass -p '81naryS0lut10ns!' ssh -o StrictHostKeyChecking=no corey@160.153.180.159 << 'ENDSSH'
  echo "Extracting to staging..."
  cd /var/www/adhdlearn.com/staging/child
  sudo rm -rf assets index.html
  sudo tar --strip-components=0 -xzf /tmp/child-staging-deploy.tar.gz
  sudo chown -R www-data:www-data /var/www/adhdlearn.com/staging/child
  echo "Deployment complete!"
ENDSSH

echo -e "${GREEN}✅ Deployed to https://child-staging.adhdlearn.com${NC}"
echo ""
echo -e "${YELLOW}🧪 Ready to test!${NC}"
