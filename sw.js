// onmedic Service Worker
// Cache strategy per millor performance

const CACHE_NAME = 'onmedic-v1.0.1';
const STATIC_CACHE = 'onmedic-static-v1.0.1';
const DYNAMIC_CACHE = 'onmedic-dynamic-v1.0.1';

// Recursos per cachear immediatament (SENSE index.html per evitar problemes)
const urlsToCache = [
    '/src/styles/main.css',
    '/src/scripts/main.js',
    '/src/scripts/animations.js',
    '/src/assets/images/logo-onmedic.jpg',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap'
];

// Install event - cache recursos crítics
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Service Worker: Static files cached');
                return self.skipWaiting();
            })
    );
});

// Activate event - neteja caches antics
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Claiming clients');
            return self.clients.claim();
        })
    );
});

// Fetch event - estratègia cache-first per recursos estàtics, network-first per dinàmics
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    
    // Skip requests from extensions, chrome-extension, etc.
    if (!requestUrl.protocol.startsWith('http')) {
        return;
    }
    
    // Skip analytics requests
    if (requestUrl.hostname.includes('google-analytics.com') || 
        requestUrl.hostname.includes('googletagmanager.com')) {
        return;
    }
    
    event.respondWith(
        // Check if it's a static resource
        isStaticResource(event.request.url) 
            ? handleStaticResource(event.request)
            : handleDynamicResource(event.request)
    );
});

// Check if resource is static (CSS, JS, images, fonts) - EXCLUDING index.html
function isStaticResource(url) {
    // Never cache index.html as static to avoid serving old content
    if (url.endsWith('/') || url.endsWith('index.html') || url === location.origin) {
        return false;
    }
    
    return /\.(css|js|jpg|jpeg|png|webp|svg|woff2?|ttf|eot)$/i.test(url) ||
           url.includes('/src/assets/') ||
           url.includes('/src/styles/') ||
           url.includes('/src/scripts/') ||
           url.includes('fonts.googleapis.com') ||
           url.includes('fonts.gstatic.com');
}

// Cache-first strategy for static resources
function handleStaticResource(request) {
    return caches.match(request)
        .then(response => {
            if (response) {
                return response;
            }
            
            return fetch(request)
                .then(response => {
                    // Don't cache if not a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    const responseToCache = response.clone();
                    caches.open(STATIC_CACHE)
                        .then(cache => {
                            cache.put(request, responseToCache);
                        });
                    
                    return response;
                })
                .catch(() => {
                    // Return fallback if available
                    if (request.destination === 'image') {
                        return new Response(
                            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Imatge no disponible</text></svg>',
                            { headers: { 'Content-Type': 'image/svg+xml' } }
                        );
                    }
                    return new Response('Recurs no disponible', { status: 404 });
                });
        });
}

// Network-first strategy for dynamic content
function handleDynamicResource(request) {
    return fetch(request)
        .then(response => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200) {
                return response;
            }
            
            // Cache successful responses
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE)
                .then(cache => {
                    cache.put(request, responseToCache);
                });
            
            return response;
        })
        .catch(() => {
            // Return cached version if network fails
            return caches.match(request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    
                    // Return offline fallback for HTML requests
                    if (request.headers.get('accept').includes('text/html')) {
                        return new Response(
                            `<!DOCTYPE html>
                            <html>
                            <head>
                                <title>onmedic - Offline</title>
                                <meta charset="utf-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <style>
                                    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                                           text-align: center; padding: 50px; color: #333; }
                                    h1 { color: #0A2342; }
                                    .logo { font-size: 2rem; font-weight: bold; margin-bottom: 1rem; }
                                </style>
                            </head>
                            <body>
                                <div class="logo">onmedic</div>
                                <h1>No hi ha connexió</h1>
                                <p>No es pot connectar amb el servidor. Comproveu la vostra connexió a Internet.</p>
                                <button onclick="location.reload()">Tornar a intentar</button>
                            </body>
                            </html>`,
                            { 
                                headers: { 'Content-Type': 'text/html' },
                                status: 200
                            }
                        );
                    }
                    
                    return new Response('No disponible offline', { status: 404 });
                });
        });
}

// Background sync for form submissions (si es vol implementar)
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync-form') {
        event.waitUntil(
            // Handle offline form submissions
            console.log('Background sync: Form submission')
        );
    }
});

// Push notifications (per futures funcionalitats)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/src/assets/images/logo-onmedic.jpg',
            badge: '/src/assets/images/logo-onmedic.jpg',
            data: data.url
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.notification.data) {
        event.waitUntil(
            clients.openWindow(event.notification.data)
        );
    }
});