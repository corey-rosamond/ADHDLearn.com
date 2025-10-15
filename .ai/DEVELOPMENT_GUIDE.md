# Development Guide - Cache Management

## Problem: Service Worker Caching

The game uses a **Service Worker** for PWA (Progressive Web App) functionality. This caches all assets for offline use, but during development, this means you can't see your changes without clearing the cache.

## Solution: Automatic Development Mode Detection

The game now **automatically detects** when you're in development mode and:
1. ✅ **Disables** the service worker
2. ✅ **Unregisters** any existing service workers
3. ✅ **Clears** all caches automatically
4. ✅ **Allows** normal browser refresh to work

## Development Mode Detection

The game detects development mode when running on:
- ✅ `localhost` (any port)
- ✅ `127.0.0.1` (any port)
- ✅ `file://` protocol (opening HTML directly)
- ✅ Port `5500` (VS Code Live Server)
- ✅ Port `8000` (Python SimpleHTTPServer)
- ✅ Port `3000` (Common dev server)

## Quick Start for Development

### Option 1: VS Code Live Server (Recommended)

1. Install **Live Server** extension in VS Code
2. Right-click `index.html` → **"Open with Live Server"**
3. Game opens at `http://127.0.0.1:5500/`
4. ✅ Development mode active - just hit **F5 to refresh**

### Option 2: Python HTTP Server

```bash
# In project directory
python3 -m http.server 8000

# Open browser to:
http://localhost:8000/
```
✅ Development mode active - just hit **F5 to refresh**

### Option 3: Direct File Opening

1. Double-click `index.html` in file explorer
2. Opens as `file:///path/to/index.html`
3. ✅ Development mode active - just hit **F5 to refresh**

## Verify Development Mode

Open the browser console (F12) and look for:

```
[DEV] Development mode detected - disabling service worker
[DEV] Service worker unregistered: ServiceWorkerRegistration {...}
[DEV] Clearing cache: aurora-reading-v1
```

If you see these messages, **development mode is active** and caching is disabled.

## Production Mode

When you deploy to your live server (e.g., `https://aurorasreading.com`), the service worker will:
- ✅ Register automatically
- ✅ Cache all assets
- ✅ Enable offline functionality
- ✅ Provide PWA install prompt

## Manual Cache Clearing (If Needed)

If you're **still** seeing cached content:

### Chrome/Edge
1. Open DevTools (F12)
2. Go to **Application** tab
3. Under **Storage** → Click **"Clear site data"**
4. Check all boxes
5. Click **"Clear data"**
6. **Hard refresh**: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

### Firefox
1. Open DevTools (F12)
2. Go to **Storage** tab
3. Right-click on your domain → **"Delete All"**
4. **Hard refresh**: `Ctrl+F5` (or `Cmd+Shift+R` on Mac)

### Nuclear Option: Unregister Service Worker Manually

Open browser console (F12) and run:

```javascript
// Unregister all service workers
navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.unregister());
    console.log('All service workers unregistered');
});

// Clear all caches
caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => caches.delete(cacheName));
    console.log('All caches cleared');
});
```

Then **hard refresh**: `Ctrl+Shift+R`

## Browser Cache vs Service Worker Cache

**Two different caches:**

| Type | What It Caches | How to Clear |
|------|----------------|--------------|
| **Browser Cache** | Images, CSS, JS requested by browser | `Ctrl+Shift+R` (hard refresh) |
| **Service Worker Cache** | Everything the SW decided to cache | DevTools → Clear site data |

During development, **both are now disabled automatically**.

## Troubleshooting

### "I'm still seeing old content"

**Check the console:**
```
[DEV] Development mode detected - disabling service worker
```

If you **don't see** this message:
- ❌ You're not in development mode
- ✅ Check your URL (should be localhost, 127.0.0.1, or file://)
- ✅ Try opening via a local server instead of double-clicking

### "Service worker keeps registering"

If you see:
```
[PWA] Production mode - registering service worker
```

You're in **production mode**. This means:
- Your hostname is not localhost/127.0.0.1
- You're not on a recognized dev port

**Solution:** Use one of the development methods above.

## Adding Custom Dev Ports

If you use a different port, add it to `index.html`:

```javascript
function isDevelopmentMode() {
    return hostname === 'localhost' ||
           hostname === '127.0.0.1' ||
           protocol === 'file:' ||
           window.location.port === '5500' ||
           window.location.port === '8000' ||
           window.location.port === '3000' ||
           window.location.port === 'YOUR_PORT_HERE';  // Add your port
}
```

## Development Workflow

### Recommended Workflow:

1. ✅ Open with Live Server (`127.0.0.1:5500`)
2. ✅ Make changes to code
3. ✅ **Save file** (Ctrl+S)
4. ✅ **Refresh browser** (F5)
5. ✅ See changes immediately

### What You Should NOT Need:
- ❌ Clear cache manually
- ❌ Hard refresh
- ❌ Unregister service worker
- ❌ Close and reopen browser

## Testing PWA Functionality

To test the **production** service worker behavior:

### Option 1: Build APK
```bash
npx cap sync android
cd android
./gradlew assembleDebug
```
APK uses production mode (no dev detection).

### Option 2: Simulate Production Locally

1. Comment out the dev mode check in `index.html`:
```javascript
if (isDevelopmentMode()) {
    // Comment out this whole block temporarily
}
```

2. Test with Live Server
3. **Remember to uncomment before committing!**

## Best Practices

### During Development:
- ✅ Use Live Server or local HTTP server
- ✅ Keep DevTools console open to monitor messages
- ✅ Use `console.log` freely (will be visible in dev mode)

### Before Deploying:
- ✅ Test in production mode (see above)
- ✅ Verify service worker registers correctly
- ✅ Test offline functionality
- ✅ Test PWA install on mobile

### Git Commits:
- ✅ Commit with dev mode enabled in code
- ✅ Production detection happens automatically at runtime
- ✅ No need for separate dev/prod builds

---

**TL;DR:** Just use Live Server or localhost and hit F5. Everything else is automatic. 🚀
