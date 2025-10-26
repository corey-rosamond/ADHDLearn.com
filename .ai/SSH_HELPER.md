# SSH Connection Helper

**CRITICAL: Always use DOUBLE QUOTES around SSH password!**

## Working SSH Pattern

```bash
# SSH password: 81naryS0lut10ns!  ← Contains ! so needs DOUBLE quotes
sshpass -p "81naryS0lut10ns!" ssh -o StrictHostKeyChecking=no corey@160.153.180.159 "COMMAND"
```

## MySQL Connection Pattern

**Database credentials:**
- Host: 160.153.180.159
- User: adhdlearn
- Password: AuroraLearns2025!
- Database: adhdlearn

```bash
# MySQL password: DIRECT format without quotes: -pPASSWORD (no space!)
sshpass -p "81naryS0lut10ns!" ssh -o StrictHostKeyChecking=no corey@160.153.180.159 "mysql -u adhdlearn -pAuroraLearns2025! adhdlearn -e 'SQL COMMAND'"
```

**CRITICAL:**
- SSH password: Use double quotes `sshpass -p "PASSWORD"`
- MySQL password: Use `-pPASSWORD` (no space, no quotes)

## Running Database Migrations

### Method 1: Copy file then execute
```bash
# 1. Copy SQL file to server
sshpass -p "81naryS0lut10ns!" scp -o StrictHostKeyChecking=no /path/to/migration.sql corey@160.153.180.159:/tmp/migration.sql

# 2. Execute on server
sshpass -p "81naryS0lut10ns!" ssh -o StrictHostKeyChecking=no corey@160.153.180.159 "mysql -u adhdlearn -p''AuroraLearns2025!'' adhdlearn < /tmp/migration.sql"
```

### Method 2: Direct execution
```bash
cat /path/to/migration.sql | sshpass -p "81naryS0lut10ns!" ssh -o StrictHostKeyChecking=no corey@160.153.180.159 "mysql -u adhdlearn -p''AuroraLearns2025!'' adhdlearn"
```

## Common Errors

### "Permission denied" on SSH
**Cause:** Using single quotes around password with ! character
**Fix:** Use double quotes: `sshpass -p "81naryS0lut10ns!"`

### "Permission denied" on MySQL
**Possible causes:**
1. Wrong MySQL password
2. User doesn't have remote access
3. MySQL not accepting connections from that host

**Debug:**
```bash
# Check if MySQL is installed
sshpass -p "81naryS0lut10ns!" ssh -o StrictHostKeyChecking=no corey@160.153.180.159 "which mysql"

# Try connecting interactively
sshpass -p "81naryS0lut10ns!" ssh -o StrictHostKeyChecking=no corey@160.153.180.159
# Then on server: mysql -u adhdlearn -pAuroraLearns2025! adhdlearn
```

## Quick Commands

### Test SSH connection
```bash
sshpass -p "81naryS0lut10ns!" ssh -o StrictHostKeyChecking=no corey@160.153.180.159 "whoami"
```

### Test MySQL connection
```bash
sshpass -p "81naryS0lut10ns!" ssh -o StrictHostKeyChecking=no corey@160.153.180.159 "mysql -u adhdlearn -p''AuroraLearns2025!'' adhdlearn -e ''SHOW TABLES;''"
```

### List databases
```bash
sshpass -p "81naryS0lut10ns!" ssh -o StrictHostKeyChecking=no corey@160.153.180.159 "mysql -u adhdlearn -p''AuroraLearns2025!'' -e ''SHOW DATABASES;''"
```

---

**Last Updated:** October 26, 2025
**Created By:** Claude Code (to stop repeating the same password quoting mistakes)
