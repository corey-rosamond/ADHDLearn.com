/**
 * Service Worker for Aurora's Letter Adventure
 * Enables offline caching and auto-updates
 */

const CACHE_NAME = 'aurora-letter-adventure-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',

  // Game configuration and utilities
  '/src/config.js',
  '/src/utils/ResponsiveUtils.js',

  // Services
  '/src/services/AudioManager.js',

  // Game objects
  '/src/gameobjects/Bubble.js',

  // Scenes
  '/src/scenes/BootScene.js',
  '/src/scenes/PreloadScene.js',
  '/src/scenes/MainMenuScene.js',
  '/src/scenes/LetterPopScene.js',
  '/src/scenes/ResultsScene.js',

  // External dependencies
  'https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.js',
  'https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap',

  // Audio files (welcome and encouragement)
  '/assets/audio/welcome.mp3',
  '/assets/audio/success.mp3',
  '/assets/audio/pop.mp3',
  '/assets/audio/good-job.mp3',
  '/assets/audio/next-time.mp3',
  '/assets/audio/keep-trying.mp3',
  '/assets/audio/nice-try.mp3',
  '/assets/audio/almost.mp3',

  // Letter audio files (A-Z)
  '/assets/audio/letters/A.mp3',
  '/assets/audio/letters/B.mp3',
  '/assets/audio/letters/C.mp3',
  '/assets/audio/letters/D.mp3',
  '/assets/audio/letters/E.mp3',
  '/assets/audio/letters/F.mp3',
  '/assets/audio/letters/G.mp3',
  '/assets/audio/letters/H.mp3',
  '/assets/audio/letters/I.mp3',
  '/assets/audio/letters/J.mp3',
  '/assets/audio/letters/K.mp3',
  '/assets/audio/letters/L.mp3',
  '/assets/audio/letters/M.mp3',
  '/assets/audio/letters/N.mp3',
  '/assets/audio/letters/O.mp3',
  '/assets/audio/letters/P.mp3',
  '/assets/audio/letters/Q.mp3',
  '/assets/audio/letters/R.mp3',
  '/assets/audio/letters/S.mp3',
  '/assets/audio/letters/T.mp3',
  '/assets/audio/letters/U.mp3',
  '/assets/audio/letters/V.mp3',
  '/assets/audio/letters/W.mp3',
  '/assets/audio/letters/X.mp3',
  '/assets/audio/letters/Y.mp3',
  '/assets/audio/letters/Z.mp3',

  // Find letter audio files (A-Z)
  '/assets/audio/find_letter_A.mp3',
  '/assets/audio/find_letter_B.mp3',
  '/assets/audio/find_letter_C.mp3',
  '/assets/audio/find_letter_D.mp3',
  '/assets/audio/find_letter_E.mp3',
  '/assets/audio/find_letter_F.mp3',
  '/assets/audio/find_letter_G.mp3',
  '/assets/audio/find_letter_H.mp3',
  '/assets/audio/find_letter_I.mp3',
  '/assets/audio/find_letter_J.mp3',
  '/assets/audio/find_letter_K.mp3',
  '/assets/audio/find_letter_L.mp3',
  '/assets/audio/find_letter_M.mp3',
  '/assets/audio/find_letter_N.mp3',
  '/assets/audio/find_letter_O.mp3',
  '/assets/audio/find_letter_P.mp3',
  '/assets/audio/find_letter_Q.mp3',
  '/assets/audio/find_letter_R.mp3',
  '/assets/audio/find_letter_S.mp3',
  '/assets/audio/find_letter_T.mp3',
  '/assets/audio/find_letter_U.mp3',
  '/assets/audio/find_letter_V.mp3',
  '/assets/audio/find_letter_W.mp3',
  '/assets/audio/find_letter_X.mp3',
  '/assets/audio/find_letter_Y.mp3',
  '/assets/audio/find_letter_Z.mp3',

  // App icons
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png'
];

// Install event - cache all assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] Install complete');
        return self.skipWaiting(); // Activate immediately
      })
      .catch(error => {
        console.error('[Service Worker] Cache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activate complete');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return cached response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(error => {
          console.log('[Service Worker] Fetch failed, returning offline page:', error);
          // Could return a custom offline page here
        });
      })
  );
});
