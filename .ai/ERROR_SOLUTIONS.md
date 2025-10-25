# Error Solutions - Known Issues

**Purpose:** Quick reference for common errors and their proven solutions

**Last Updated:** October 25, 2025

---

## Database Connection

### Error: "Connection refused to 160.153.180.159:3306"

**Cause:** MySQL not allowing remote connections or firewall blocking

**Solution:**
1. Check MySQL user permissions:
   ```sql
   SELECT User, Host FROM mysql.user WHERE User='[username]';
   ```
2. Grant remote access if needed:
   ```sql
   GRANT ALL PRIVILEGES ON adhdlearn.* TO '[user]'@'%' IDENTIFIED BY '[password]';
   FLUSH PRIVILEGES;
   ```
3. Check firewall (on server):
   ```bash
   sudo ufw status
   sudo ufw allow 3306/tcp
   ```
4. Check MySQL config allows remote connections:
   ```bash
   # Edit /etc/mysql/mysql.conf.d/mysqld.cnf
   # Comment out: bind-address = 127.0.0.1
   sudo systemctl restart mysql
   ```

### Error: "Access denied for user"

**Cause:** Wrong credentials or user doesn't exist

**Solution:**
1. Verify credentials with user
2. Test connection:
   ```bash
   mysql -h 160.153.180.159 -u [user] -p
   ```
3. Create user if doesn't exist:
   ```sql
   CREATE USER '[user]'@'%' IDENTIFIED BY '[password]';
   GRANT ALL PRIVILEGES ON adhdlearn.* TO '[user]'@'%';
   FLUSH PRIVILEGES;
   ```

### Error: "Unknown database 'adhdlearn'"

**Cause:** Database doesn't exist yet

**Solution:**
```sql
CREATE DATABASE adhdlearn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Android ADB

### Error: "adb: command not found"

**Cause:** ADB not in PATH

**Solution:**
```bash
export ANDROID_HOME=/home/corey/android-sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Add to ~/.bashrc for persistence
echo 'export ANDROID_HOME=/home/corey/android-sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
source ~/.bashrc
```

### Error: "no devices/emulators found"

**Cause:** Device not connected or USB debugging disabled

**Solution:**
1. Check device connection:
   ```bash
   $ANDROID_HOME/platform-tools/adb devices
   ```
2. Enable USB debugging on device:
   - Settings → About → Tap "Build number" 7 times
   - Settings → Developer Options → USB Debugging (ON)
3. Restart adb:
   ```bash
   $ANDROID_HOME/platform-tools/adb kill-server
   $ANDROID_HOME/platform-tools/adb start-server
   $ANDROID_HOME/platform-tools/adb devices
   ```
4. Accept USB debugging prompt on device

### Error: "device unauthorized"

**Cause:** USB debugging authorization not accepted

**Solution:**
1. Unlock device
2. Accept "Allow USB debugging" prompt
3. Check "Always allow from this computer"
4. Retry:
   ```bash
   $ANDROID_HOME/platform-tools/adb devices
   ```

### Error: Touch commands not working reliably

**Cause:** `adb shell input tap` is unreliable

**Solution:** Use `swipe` instead of `tap`:
```bash
# Instead of: adb shell input tap X Y
# Use:
$ANDROID_HOME/platform-tools/adb shell input swipe X Y X Y 100

# The swipe from X,Y to X,Y with 100ms duration acts as a tap
```

---

## npm/Node.js

### Error: "EACCES: permission denied"

**Cause:** npm trying to write to protected directory

**Solution:**
```bash
sudo chown -R $USER ~/.npm
sudo chown -R $USER /home/corey/Desktop/ADHDLearn.com/node_modules
```

Or use nvm (Node Version Manager) to avoid permission issues:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Error: "Cannot find module"

**Cause:** Dependencies not installed or package.json out of sync

**Solution:**
1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. If specific module missing:
   ```bash
   npm install [module-name] --save
   ```

### Error: "npm ERR! code ERESOLVE"

**Cause:** Dependency conflict

**Solution:**
```bash
# Try with legacy peer deps
npm install --legacy-peer-deps

# Or force
npm install --force

# Update npm
npm install -g npm@latest
```

### Error: "node: command not found"

**Cause:** Node.js not installed or not in PATH

**Solution:**
```bash
# Check if installed
which node

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

---

## Git

### Error: "Your branch is ahead by N commits"

**Cause:** Local commits not pushed to remote

**Solution:**
```bash
git push origin staging
```

### Error: "refusing to merge unrelated histories"

**Cause:** Branches have different roots

**Solution:**
```bash
git pull origin staging --allow-unrelated-histories
```

### Error: "fatal: not a git repository"

**Cause:** Not in git repository directory

**Solution:**
```bash
cd /home/corey/Desktop/ADHDLearn.com
git status
```

### Error: "Permission denied (publickey)"

**Cause:** SSH key not set up

**Solution:**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key and add to GitHub
cat ~/.ssh/id_ed25519.pub
```

### Error: "merge conflict"

**Cause:** Same file edited in different branches

**Solution:**
```bash
# Open conflicted file, resolve conflicts (<<<<<<, =======, >>>>>> markers)
# Then:
git add [resolved-file]
git commit -m "Resolve merge conflict"
```

---

## Phaser

### Error: "Failed to load audio"

**Cause:** HTTPS required for audio playback in browsers

**Solution:**
1. Use HTTPS development server:
   ```bash
   python3 https-server.py
   ```
2. Access via https://localhost:8000
3. Accept self-signed certificate warning in browser

### Error: "Texture '[key]' not found"

**Cause:** Asset not preloaded or wrong key

**Solution:**
1. Add to PreloadScene:
   ```javascript
   this.load.image('[key]', 'path/to/image.png');
   ```
2. Verify path is correct
3. Check asset actually exists in assets folder

### Error: "AudioContext was not allowed to start"

**Cause:** Browser requires user interaction before playing audio

**Solution:**
```javascript
// Resume AudioContext on first touch/click
this.input.once('pointerdown', () => {
  if (this.sound.context.state === 'suspended') {
    this.sound.context.resume();
  }
});
```

### Error: "Scene with key '[key]' does not exist"

**Cause:** Scene not added to game config

**Solution:**
```javascript
// In src/config.js
const config = {
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    GameScene  // Add your scene here
  ]
};
```

### Error: Poor performance / Low FPS

**Cause:** Too many game objects or inefficient rendering

**Solution:**
1. Enable FPS display to diagnose:
   ```javascript
   // In create()
   this.time.advancedTiming = true;
   this.add.text(10, 10, '', { font: '16px Arial' }).setDepth(1000);

   // In update()
   this.debugText.setText(`FPS: ${this.game.loop.actualFps.toFixed(2)}`);
   ```
2. Optimize:
   - Use object pooling for frequently created/destroyed objects
   - Reduce number of physics bodies
   - Use texture atlases instead of individual images
   - Limit particles
   - Use containers for complex objects

---

## React

### Error: "Maximum update depth exceeded"

**Cause:** setState in render or useEffect without dependencies causing infinite loop

**Solution:**
```javascript
// Bad
useEffect(() => {
  setState(newValue);
});

// Good
useEffect(() => {
  setState(newValue);
}, [dependency]);

// Also good - if should only run once
useEffect(() => {
  setState(newValue);
}, []);
```

### Error: "Cannot read property of undefined"

**Cause:** Accessing nested property before data loads

**Solution:**
```javascript
// Bad
<div>{user.profile.name}</div>

// Good - optional chaining
<div>{user?.profile?.name}</div>

// Or with conditional rendering
{user && user.profile && (
  <div>{user.profile.name}</div>
)}
```

### Error: "Hook called outside function component"

**Cause:** Hooks used incorrectly

**Solution:**
- Only call hooks at top level of function component
- Don't call hooks inside loops, conditions, or nested functions
- Don't call hooks in regular JavaScript functions

```javascript
// Bad
function Component() {
  if (condition) {
    const [state, setState] = useState();  // ❌
  }
}

// Good
function Component() {
  const [state, setState] = useState();  // ✅
  if (condition) {
    // use state here
  }
}
```

### Error: "Invalid hook call"

**Cause:** Multiple versions of React or calling hooks from class component

**Solution:**
```bash
# Check for duplicate React
npm ls react

# Fix duplicate React
npm dedupe
rm -rf node_modules package-lock.json
npm install
```

---

## MySQL

### Error: "Table doesn't exist"

**Cause:** Migration not run

**Solution:**
1. Check table exists:
   ```sql
   SHOW TABLES LIKE 'table_name';
   ```
2. Run migration:
   ```bash
   mysql -h 160.153.180.159 -u [user] -p adhdlearn < backend/migrations/phase-XX.sql
   ```
3. Verify:
   ```sql
   DESCRIBE table_name;
   ```

### Error: "Duplicate entry for key 'PRIMARY'"

**Cause:** Trying to insert row with existing primary key

**Solution:**
1. Use INSERT IGNORE or ON DUPLICATE KEY UPDATE:
   ```sql
   INSERT IGNORE INTO table (id, field) VALUES (1, 'value');

   -- Or
   INSERT INTO table (id, field) VALUES (1, 'value')
   ON DUPLICATE KEY UPDATE field = 'value';
   ```
2. Or use AUTO_INCREMENT and let MySQL assign IDs

### Error: "Column count doesn't match value count"

**Cause:** INSERT statement has wrong number of values

**Solution:**
```sql
-- Bad
INSERT INTO users (name, email) VALUES ('John');  -- Missing email

-- Good
INSERT INTO users (name, email) VALUES ('John', 'john@example.com');
```

### Error: "Unknown column in field list"

**Cause:** Column doesn't exist in table

**Solution:**
1. Check table structure:
   ```sql
   DESCRIBE table_name;
   ```
2. Add missing column:
   ```sql
   ALTER TABLE table_name ADD COLUMN column_name VARCHAR(255);
   ```

---

## Express/Backend

### Error: "CORS policy blocked"

**Cause:** CORS not configured or wrong origin

**Solution:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://child.adhdlearn.com',
    'https://parent.adhdlearn.com',
    'https://staging.child.adhdlearn.com',
    'https://staging.parent.adhdlearn.com',
    'https://localhost:8000'  // Development
  ],
  credentials: true
}));
```

### Error: "JWT expired"

**Cause:** Token expired

**Solution:**
1. Check token expiration in middleware
2. Implement refresh token logic
3. Return 401 and prompt re-login on frontend:
   ```javascript
   if (error.name === 'TokenExpiredError') {
     return res.status(401).json({
       success: false,
       error: 'Session expired. Please log in again.'
     });
   }
   ```

### Error: "Cannot set headers after they are sent"

**Cause:** Trying to send response twice

**Solution:**
```javascript
// Bad
app.get('/api/resource', (req, res) => {
  res.json({ data: 'value' });
  res.json({ data: 'another' });  // ❌ Error
});

// Good - use return
app.get('/api/resource', (req, res) => {
  if (condition) {
    return res.json({ data: 'value' });  // ✅ Return stops execution
  }
  res.json({ data: 'another' });
});
```

### Error: "Port already in use"

**Cause:** Another process using the port

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 [PID]

# Or use different port in server.js
const PORT = process.env.PORT || 5001;
```

---

## Build/Deploy

### Error: "npm run build fails"

**Cause:** Various (check error message)

**Common solutions:**
1. Check for console.log referencing undefined:
   ```javascript
   // Remove or fix these
   console.log(someUndefinedVariable);
   ```
2. Check for missing imports:
   ```javascript
   // Make sure all imports exist
   import Component from './components/Component';
   ```
3. Clear dist and rebuild:
   ```bash
   rm -rf dist
   npm run build
   ```
4. Check for circular dependencies
5. Update dependencies:
   ```bash
   npm update
   ```

### Error: "Module not found: Can't resolve"

**Cause:** Import path wrong or module not installed

**Solution:**
1. Check import path is correct (case-sensitive)
2. Install missing module:
   ```bash
   npm install [module-name]
   ```
3. Check file actually exists at import path

### Error: "JavaScript heap out of memory"

**Cause:** Build process needs more memory

**Solution:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## Apache/Server

### Error: "403 Forbidden"

**Cause:** Permissions issue or .htaccess blocking

**Solution:**
```bash
# Fix permissions
sudo chown -R www-data:www-data /var/www/[domain]
sudo chmod -R 755 /var/www/[domain]

# Check Apache error log
sudo tail -f /var/log/apache2/error.log
```

### Error: "500 Internal Server Error"

**Cause:** Server misconfiguration or PHP/backend error

**Solution:**
1. Check Apache error log:
   ```bash
   sudo tail -f /var/log/apache2/error.log
   ```
2. Check application logs
3. Verify .htaccess syntax
4. Check file permissions

### Error: "SSL certificate problem"

**Cause:** Let's Encrypt certificate expired or not installed

**Solution:**
```bash
# Renew certificate
sudo certbot renew

# Or manually for specific domain
sudo certbot --apache -d adhdlearn.com -d www.adhdlearn.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## PM2 (Process Manager)

### Error: "PM2: command not found"

**Cause:** PM2 not installed

**Solution:**
```bash
npm install -g pm2
```

### Error: "Process not found"

**Cause:** Process not started or wrong name

**Solution:**
```bash
# List all processes
pm2 list

# Start process
pm2 start server.js --name api-staging

# Restart
pm2 restart api-staging

# Stop
pm2 stop api-staging
```

### Error: Backend not restarting after deploy

**Cause:** PM2 not picking up changes

**Solution:**
```bash
# Restart with latest code
pm2 restart api-staging --update-env

# Or reload (zero-downtime)
pm2 reload api-staging

# Check logs
pm2 logs api-staging
```

---

## Capacitor

### Error: "Capacitor: command not found"

**Cause:** Capacitor CLI not installed

**Solution:**
```bash
npm install -g @capacitor/cli
```

### Error: "Cannot find module '@capacitor/core'"

**Cause:** Capacitor dependencies not installed

**Solution:**
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

### Error: "Gradle build failed"

**Cause:** Android build error

**Solution:**
1. Check Android Studio SDK installed
2. Set ANDROID_HOME:
   ```bash
   export ANDROID_HOME=/home/corey/android-sdk
   ```
3. Clean and rebuild:
   ```bash
   cd android
   ./gradlew clean
   ./gradlew assembleDebug
   ```
4. Check gradle logs for specific error

---

## Always Try First

**Before asking user:**
1. ✅ Check this file for known solutions
2. ✅ Check MEMORY.md for recent similar issues
3. ✅ Read error message carefully (Google exact message)
4. ✅ Check relevant documentation
5. ✅ Try obvious fixes (restart, reinstall, clear cache)
6. ✅ Check logs for more details

**Common debugging steps:**
```bash
# Check logs
sudo tail -f /var/log/apache2/error.log  # Apache
pm2 logs api-staging                      # Backend
journalctl -xe                            # System

# Check status
systemctl status apache2
pm2 status
git status

# Check network
curl https://api.adhdlearn.com/api/health
ping 160.153.180.159

# Check processes
ps aux | grep node
lsof -i :5000

# Check disk space
df -h
```

---

**Add new solutions as you discover them**

**Format:**
```markdown
### Error: "Exact error message"

**Cause:** Why this happens

**Solution:**
Steps to fix...
```

---

**Created:** October 25, 2025
**Last Updated:** October 25, 2025
**Maintained By:** Corey (developer) + Claude Code
**Purpose:** Reduce troubleshooting time, avoid repeating solved problems
