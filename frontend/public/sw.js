// Service Worker for USFTT PWA
const CACHE_NAME = 'usftt-v1'
const CSV_CACHE_NAME = 'usftt-csv-v1'

// Static assets to cache on install
const STATIC_ASSETS = [
  '/usftt/',
  '/usftt/index.html',
  '/usftt/manifest.json',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Failed to cache some static assets:', err)
      })
    })
  )
  // Activate immediately
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== CSV_CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  // Take control of all pages immediately
  return self.clients.claim()
})

// Fetch event - network first, fallback to cache for CSV files
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Handle CSV files with network-first strategy
  if (url.pathname.endsWith('.csv')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response before caching
          const responseClone = response.clone()
          caches.open(CSV_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
          return response
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request).then((cached) => {
            if (cached) {
              return cached
            }
            // Return offline response if no cache
            return new Response('Offline - no cached data available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain',
              }),
            })
          })
        })
    )
    return
  }

  // Cache-first for static assets (JS, CSS, images)
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          return cached
        }
        return fetch(event.request).then((response) => {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
          return response
        })
      })
    )
    return
  }

  // Network-first for everything else
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request)
    })
  )
})
