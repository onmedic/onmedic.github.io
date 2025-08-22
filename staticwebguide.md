# 🌐 Guia Completa: Construir Sites Estàtics Professionals

## 📋 Índex

1. [Arquitectura Base](#arquitectura-base)
2. [Sistema Multiidioma](#sistema-multiidioma) 
3. [SEO Professional](#seo-professional)
4. [Performance i Core Web Vitals](#performance-i-core-web-vitals)
5. [Seguretat](#seguretat)
6. [Desplegament Automàtic](#desplegament-automàtic)
7. [Monitorització i Analytics](#monitorització-i-analytics)
8. [Checklist Final](#checklist-final)

---

## 🏗️ Arquitectura Base

### Estructura de Directoris Recomanada
```
project-name/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   ├── styles/
│   │   ├── critical.css      # CSS crític inline
│   │   └── main.css          # CSS principal
│   ├── scripts/
│   │   ├── analytics.js
│   │   └── performance.js
│   └── languages/
│       ├── ca/               # Català
│       │   ├── index.html
│       │   ├── services.html
│       │   └── contact.html
│       ├── es/               # Español  
│       └── en/               # English
├── build/                    # Output generat
├── scripts/
│   ├── build.sh             # Script de construcció
│   ├── deploy.sh            # Script de desplegament
│   └── validate-seo.sh      # Validació SEO
├── config/
│   ├── netlify.toml         # Configuració Netlify
│   ├── _headers             # Headers HTTP
│   └── _redirects           # Redirects
├── robots.txt
├── sitemap-index.xml
└── package.json             # Dependències opcionals
```

### HTML Base Template
```html
<!DOCTYPE html>
<html lang="{{LANG}}" dir="ltr">
<head>
    <!-- Meta bàsics -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Core -->
    <title>{{PAGE_TITLE}} | {{SITE_NAME}}</title>
    <meta name="description" content="{{PAGE_DESCRIPTION}}">
    <meta name="keywords" content="{{PAGE_KEYWORDS}}">
    
    <!-- Canonical i hreflang -->
    <link rel="canonical" href="{{CANONICAL_URL}}">
    <link rel="alternate" hreflang="ca" href="{{BASE_URL}}/ca/{{PAGE}}">
    <link rel="alternate" hreflang="es" href="{{BASE_URL}}/es/{{PAGE}}">
    <link rel="alternate" hreflang="en" href="{{BASE_URL}}/en/{{PAGE}}">
    <link rel="alternate" hreflang="x-default" href="{{BASE_URL}}/ca/{{PAGE}}">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="{{OG_TITLE}}">
    <meta property="og:description" content="{{OG_DESCRIPTION}}">
    <meta property="og:url" content="{{CANONICAL_URL}}">
    <meta property="og:site_name" content="{{SITE_NAME}}">
    <meta property="og:image" content="{{OG_IMAGE}}">
    <meta property="og:locale" content="{{OG_LOCALE}}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{TWITTER_TITLE}}">
    <meta name="twitter:description" content="{{TWITTER_DESCRIPTION}}">
    <meta name="twitter:image" content="{{TWITTER_IMAGE}}">
    
    <!-- GEO Tags -->
    <meta name="geo.region" content="{{GEO_REGION}}">
    <meta name="geo.placename" content="{{GEO_CITY}}">
    <meta name="geo.position" content="{{GEO_LAT}};{{GEO_LON}}">
    <meta name="ICBM" content="{{GEO_LAT}}, {{GEO_LON}}">
    
    <!-- Performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="/fonts/main-font.woff2" as="font" type="font/woff2" crossorigin>
    
    <!-- Theme -->
    <meta name="theme-color" content="{{THEME_COLOR}}">
    <meta name="color-scheme" content="light dark">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    
    <!-- CSS Crític Inline -->
    <style>
        /* CSS crític per Above-the-Fold */
        {{CRITICAL_CSS}}
    </style>
    
    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "{{SITE_NAME}}",
        "url": "{{BASE_URL}}",
        "description": "{{SITE_DESCRIPTION}}",
        "inLanguage": ["ca", "es", "en"],
        "publisher": {
            "@type": "Organization",
            "name": "{{ORGANIZATION_NAME}}",
            "url": "{{BASE_URL}}"
        }
    }
    </script>
</head>
<body>
    <!-- Contingut principal -->
    <main>
        {{MAIN_CONTENT}}
    </main>
    
    <!-- Scripts no bloquejants -->
    <script async src="/js/main.js"></script>
    <script async src="https://www.googletagmanager.com/gtag/js?id={{GA_ID}}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '{{GA_ID}}');
    </script>
</body>
</html>
```

---

## 🌍 Sistema Multiidioma

### 1. Detecció Automàtica d'Idioma
```javascript
// language-detector.js
function detectUserLanguage() {
    // 1. URL parameter (?lang=es)
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && ['ca', 'es', 'en'].includes(langParam)) {
        return langParam;
    }
    
    // 2. LocalStorage (previous choice)
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang && ['ca', 'es', 'en'].includes(storedLang)) {
        return storedLang;
    }
    
    // 3. Browser language
    const browserLang = navigator.language || navigator.languages[0] || 'en';
    
    if (browserLang.startsWith('ca')) return 'ca';
    if (browserLang.startsWith('es')) return 'es';
    return 'en'; // Fallback
}

function redirectToLanguage() {
    const currentPath = window.location.pathname;
    const hasLanguageInPath = /^\/(ca|es|en)\//.test(currentPath);
    
    if (!hasLanguageInPath) {
        const detectedLang = detectUserLanguage();
        const newPath = `/${detectedLang}${currentPath === '/' ? '' : currentPath}`;
        
        // Save preference
        localStorage.setItem('preferredLanguage', detectedLang);
        
        window.location.href = newPath;
    }
}

// Execute on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', redirectToLanguage);
} else {
    redirectToLanguage();
}
```

### 2. Language Switcher Component
```html
<div class="language-switcher">
    <button class="lang-btn" onclick="switchLanguage('ca')" data-lang="ca">🇪🇸 CAT</button>
    <button class="lang-btn" onclick="switchLanguage('es')" data-lang="es">🇪🇸 ESP</button>
    <button class="lang-btn" onclick="switchLanguage('en')" data-lang="en">🇬🇧 ENG</button>
</div>

<script>
function switchLanguage(newLang) {
    const currentPath = window.location.pathname;
    const currentLang = currentPath.match(/^\/(ca|es|en)\//)?.[1] || 'ca';
    const newPath = currentPath.replace(`/${currentLang}/`, `/${newLang}/`);
    
    localStorage.setItem('preferredLanguage', newLang);
    window.location.href = newPath;
}

// Highlight current language
document.addEventListener('DOMContentLoaded', () => {
    const currentLang = window.location.pathname.match(/^\/(ca|es|en)\//)?.[1] || 'ca';
    document.querySelector(`[data-lang="${currentLang}"]`)?.classList.add('active');
});
</script>
```

### 3. Configuració Redirects (_redirects)
```
# Auto-redirect arrel segons idioma navegador
/  /ca/  302

# Redirects compatibilitat sense idioma
/services  /ca/services  200
/pricing   /ca/pricing   200  
/contact   /ca/contact   200

# Redirect www a domini principal
https://www.example.com/*  https://example.com/:splat  301!
```

---

## 🎯 SEO Professional

### 1. Meta Tags Completes per Tipus de Pàgina

#### Homepage
```html
<!-- Homepage específic -->
<meta name="description" content="[Descripció de 150-160 chars amb keyword principal]">
<meta name="keywords" content="keyword1, keyword2, keyword3, long-tail keyword">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">

<!-- Schema.org WebSite -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "{{SITE_NAME}}",
    "url": "{{BASE_URL}}",
    "potentialAction": {
        "@type": "SearchAction",
        "target": "{{BASE_URL}}/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
    }
}
</script>
```

#### Services/Products Page
```html
<meta property="og:type" content="product">

<!-- Schema.org Service -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "{{SERVICE_NAME}}",
    "description": "{{SERVICE_DESCRIPTION}}",
    "provider": {
        "@type": "Organization",
        "name": "{{ORGANIZATION_NAME}}"
    },
    "offers": {
        "@type": "Offer",
        "price": "{{PRICE}}",
        "priceCurrency": "EUR"
    }
}
</script>
```

#### Contact Page
```html
<!-- Schema.org Local Business -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "{{BUSINESS_NAME}}",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "{{STREET}}",
        "addressLocality": "{{CITY}}",
        "addressRegion": "{{REGION}}",
        "postalCode": "{{POSTAL_CODE}}",
        "addressCountry": "{{COUNTRY_CODE}}"
    },
    "telephone": "{{PHONE}}",
    "email": "{{EMAIL}}",
    "url": "{{WEBSITE}}"
}
</script>
```

### 2. Sitemaps Multiidioma

#### sitemap-index.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>{{BASE_URL}}/sitemap-ca.xml</loc>
        <lastmod>{{CURRENT_DATE}}</lastmod>
    </sitemap>
    <sitemap>
        <loc>{{BASE_URL}}/sitemap-es.xml</loc>
        <lastmod>{{CURRENT_DATE}}</lastmod>
    </sitemap>
    <sitemap>
        <loc>{{BASE_URL}}/sitemap-en.xml</loc>
        <lastmod>{{CURRENT_DATE}}</lastmod>
    </sitemap>
</sitemapindex>
```

#### sitemap-[lang].xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
    
    <url>
        <loc>{{BASE_URL}}/{{LANG}}/</loc>
        <lastmod>{{LAST_MODIFIED}}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
        
        <!-- Hreflang per cada URL -->
        <xhtml:link rel="alternate" hreflang="ca" href="{{BASE_URL}}/ca/"/>
        <xhtml:link rel="alternate" hreflang="es" href="{{BASE_URL}}/es/"/>
        <xhtml:link rel="alternate" hreflang="en" href="{{BASE_URL}}/en/"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="{{BASE_URL}}/ca/"/>
    </url>
    
    <!-- Repetir per cada pàgina -->
</urlset>
```

### 3. robots.txt Professional
```
User-agent: *
Allow: /

# Sitemaps multiidioma  
Sitemap: {{BASE_URL}}/sitemap-index.xml
Sitemap: {{BASE_URL}}/sitemap-ca.xml
Sitemap: {{BASE_URL}}/sitemap-es.xml
Sitemap: {{BASE_URL}}/sitemap-en.xml

# Bloquejats
Disallow: /admin/
Disallow: /private/
Disallow: /temp/
Disallow: *.tmp
Disallow: /api/

# Crawling optimitzat
Crawl-delay: 1

# Informació contacte
# Contact: seo@{{DOMAIN}}
```

---

## ⚡ Performance i Core Web Vitals

### 1. CSS Crític Inline
```html
<head>
    <style>
        /* CSS crític per Above-the-Fold - màx 14KB */
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            margin: 0; 
            line-height: 1.6; 
        }
        .hero { 
            min-height: 100vh; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
        }
        /* Només estils visibles inicialment */
    </style>
    
    <!-- CSS no crític carregat asíncronament -->
    <link rel="preload" href="/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="/css/main.css"></noscript>
</head>
```

### 2. Optimització d'Imatges
```html
<!-- WebP amb fallback -->
<picture>
    <source srcset="hero-image.webp" type="image/webp">
    <source srcset="hero-image.avif" type="image/avif">
    <img src="hero-image.jpg" 
         alt="Hero image description"
         width="800" 
         height="600"
         loading="eager"
         decoding="async">
</picture>

<!-- Imatges lazy amb intersectionObserver -->
<img src="placeholder.jpg" 
     data-src="real-image.jpg"
     alt="Description"
     loading="lazy"
     decoding="async"
     class="lazy-image">

<script>
// Lazy loading personalitzat
const images = document.querySelectorAll('.lazy-image');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy-image');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));
</script>
```

### 3. Resource Hints
```html
<!-- Preconnect per dominis externs crítics -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://www.google-analytics.com">

<!-- Preload recursos crítics -->
<link rel="preload" href="/fonts/main-font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/css/critical.css" as="style">
<link rel="preload" href="/images/hero.webp" as="image">

<!-- Prefetch recursos següents pàgines -->
<link rel="prefetch" href="/ca/services">
<link rel="prefetch" href="/ca/pricing">

<!-- DNS prefetch per dominis menys crítics -->
<link rel="dns-prefetch" href="https://analytics.google.com">
```

### 4. Service Worker per Cache
```javascript
// sw.js
const CACHE_NAME = 'site-cache-v1';
const urlsToCache = [
    '/',
    '/ca/',
    '/css/main.css',
    '/js/main.js',
    '/images/logo.webp'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna cache si existeix, sinó fetch
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});
```

---

## 🔒 Seguretat

### 1. Headers de Seguretat (_headers)
```
/*
  # Seguretat bàsica
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  
  # HSTS
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  
  # CSP (Content Security Policy)
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' *.googleapis.com *.google-analytics.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: *.google-analytics.com; font-src 'self' *.gstatic.com; connect-src 'self' *.google-analytics.com
  
  # Feature Policy / Permissions Policy
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()

# Cache headers per tipus de recurs
/*.html
  Cache-Control: public, max-age=3600, must-revalidate

/css/*
  Cache-Control: public, max-age=31536000, immutable

/js/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable
```

### 2. Configuració HTTPS (netlify.toml)
```toml
[[redirects]]
  from = "http://example.com/*"
  to = "https://example.com/:splat"
  status = 301
  force = true

[[redirects]]
  from = "http://www.example.com/*"
  to = "https://example.com/:splat"
  status = 301
  force = true

[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
```

---

## 🚀 Desplegament Automàtic

### 1. Script de Build (build.sh)
```bash
#!/bin/bash
set -e

echo "🏗️  Building static site..."

# Netejar builds anteriors
rm -rf build/
mkdir -p build/{ca,es,en}
mkdir -p build/assets/{css,js,images,fonts}

# Processar cada idioma
for lang in ca es en; do
    echo "📄 Processing $lang pages..."
    
    # Copiar i processar HTML templates
    for template in src/templates/*.html; do
        filename=$(basename "$template")
        
        # Substituir variables segons idioma
        sed -e "s/{{LANG}}/$lang/g" \
            -e "s|{{BASE_URL}}|$BASE_URL|g" \
            -e "s/{{SITE_NAME}}/$SITE_NAME/g" \
            "$template" > "build/$lang/$filename"
    done
done

# Copiar assets
echo "🎨 Copying assets..."
cp -r src/assets/* build/assets/
cp src/robots.txt build/
cp src/sitemap*.xml build/

# Optimitzar imatges (opcional amb imagemin)
if command -v imagemin &> /dev/null; then
    echo "🖼️  Optimizing images..."
    imagemin build/assets/images/* --out-dir=build/assets/images/
fi

# Generar CSS mínim
echo "💅 Processing CSS..."
cat src/css/critical.css > build/assets/css/critical.css
cat src/css/*.css > build/assets/css/main.css

echo "✅ Build completed!"
echo "📁 Output: build/"
```

### 2. Script de Deploy (deploy.sh)
```bash
#!/bin/bash
set -e

echo "🚀 Deploying to production..."

# Build primer
./scripts/build.sh

# Validació pre-deploy
echo "🔍 Pre-deploy validation..."

# Verificar que tots els fitxers crítics existeixen
required_files=("build/robots.txt" "build/sitemap-index.xml")
for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        echo "❌ Missing required file: $file"
        exit 1
    fi
done

# Verificar meta descriptions
echo "📝 Checking meta descriptions..."
if ! grep -r "meta.*description" build/ca/*.html > /dev/null; then
    echo "⚠️  Warning: Some pages missing meta descriptions"
fi

# Deploy segons plataforma
if [[ "$DEPLOY_PLATFORM" == "netlify" ]]; then
    echo "🌐 Deploying to Netlify..."
    netlify deploy --prod --dir=build
elif [[ "$DEPLOY_PLATFORM" == "vercel" ]]; then
    echo "▲ Deploying to Vercel..."
    vercel --prod build/
else
    echo "📦 Deploying via rsync..."
    rsync -avz --delete build/ user@server:/var/www/html/
fi

echo "✅ Deployment completed!"
```

### 3. Configuració CI/CD (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy Static Site

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build site
      run: ./scripts/build.sh
      env:
        BASE_URL: ${{ secrets.BASE_URL }}
        SITE_NAME: ${{ secrets.SITE_NAME }}
    
    - name: Run SEO validation
      run: ./scripts/validate-seo.sh
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2
      with:
        publish-dir: './build'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 📊 Monitorització i Analytics

### 1. Google Analytics 4 Optimitzat
```html
<!-- GA4 amb events personalitzats -->
<script async src="https://www.googletagmanager.com/gtag/js?id={{GA_ID}}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('js', new Date());
gtag('config', '{{GA_ID}}', {
    // Privacy respectful
    anonymize_ip: true,
    cookie_expires: 63072000, // 2 years
    
    // Enhanced ecommerce (si aplica)
    send_page_view: true,
    
    // Custom dimensions
    custom_map: {
        'dimension1': 'language',
        'dimension2': 'user_type'
    }
});

// Track language
gtag('event', 'page_view', {
    language: document.documentElement.lang
});

// Track scroll depth
let maxScroll = 0;
window.addEventListener('scroll', throttle(() => {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        gtag('event', 'scroll', {
            event_category: 'Engagement',
            event_label: `${maxScroll}%`,
            value: maxScroll
        });
    }
}, 500));

// Track outbound links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.hostname !== location.hostname) {
        gtag('event', 'click', {
            event_category: 'Outbound Link',
            event_label: link.href,
            transport_type: 'beacon'
        });
    }
});

// Throttle helper
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
</script>
```

### 2. Core Web Vitals Tracking
```javascript
// core-web-vitals.js
function sendToAnalytics({name, value, id}) {
    gtag('event', name, {
        event_category: 'Web Vitals',
        event_label: id,
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        non_interaction: true
    });
}

// Carrega la libreria de Google
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 3. Error Tracking
```javascript
// error-tracking.js
window.addEventListener('error', (e) => {
    gtag('event', 'exception', {
        description: `${e.filename}:${e.lineno} - ${e.message}`,
        fatal: false
    });
});

window.addEventListener('unhandledrejection', (e) => {
    gtag('event', 'exception', {
        description: `Promise rejection: ${e.reason}`,
        fatal: false
    });
});

// Track 404 errors
if (document.title.includes('404') || window.location.pathname.includes('404')) {
    gtag('event', 'page_view', {
        page_title: '404 Error',
        page_location: window.location.href,
        content_group1: 'Error'
    });
}
```

---

## ✅ Checklist Final

### 🔴 Pre-Launch (Crític)
- [ ] **HTML Vàlid**: Validar amb W3C Validator
- [ ] **Meta tags complets**: title, description, OG, Twitter per TOTES les pàgines
- [ ] **hreflang tags**: Implementats a TOTES les pàgines multiidioma
- [ ] **Sitemaps**: Index + individuais per idioma
- [ ] **robots.txt**: Configurat correctament
- [ ] **404 personalitzat**: Pàgina d'error funcional
- [ ] **HTTPS**: SSL configurat i redirects HTTP→HTTPS
- [ ] **Performance**: LCP < 2.5s, FID < 100ms, CLS < 0.1

### 🟡 Pre-Launch (Important)  
- [ ] **Schema.org**: Structured data per tipus de pàgina
- [ ] **Analytics**: GA4 configurat amb events
- [ ] **Headers de seguretat**: CSP, HSTS, etc.
- [ ] **Cache policies**: Headers per cada tipus de recurs  
- [ ] **Mobile responsive**: Test en diferents dispositius
- [ ] **Accessibility**: WCAG 2.1 AA compliance bàsic
- [ ] **Fonts optimitzats**: Preload, display: swap

### 🟢 Post-Launch (Millores)
- [ ] **Service Worker**: Cache offline
- [ ] **PWA features**: Manifest, icons
- [ ] **Advanced tracking**: Core Web Vitals, scroll depth
- [ ] **A/B testing**: Setup per optimitzacions
- [ ] **CDN**: Configuració per assets estàtics
- [ ] **Monitoring**: Uptime, performance alerts
- [ ] **Lighthouse CI**: Automated performance testing

### 📊 Mètriques Objectiu
- **Google PageSpeed**: 90+ mobile, 95+ desktop
- **GTmetrix Grade**: A (90%+)
- **Core Web Vitals**: Tots en verd
- **SEO Score**: 95+ segons tool preferit
- **Accessibility**: 90+ segons axe/WAVE

---

## 🛠️ Eines Recomanades

### Development
- **Editor**: VS Code amb extensions HTML/CSS
- **Build**: Scripts Bash o Gulp/Webpack si prefereix Node
- **Linting**: HTMLHint, Stylelint, ESLint
- **Testing**: Cypress per E2E, Jest per JS

### SEO & Performance
- **Google PageSpeed Insights**: Core Web Vitals
- **GTmetrix**: Performance detallat
- **WebPageTest**: Testing avançat
- **Google Search Console**: Monitoring SEO
- **Screaming Frog**: Audit SEO tècnic

### Desplegament
- **Netlify**: Recomanat per sites estàtics
- **Vercel**: Alternativa excellent 
- **Cloudflare Pages**: CDN integrat
- **GitHub Pages**: Gratuït per projectes públics

---

**🎯 Resultat final:** Un site estàtic professional, ràpid, segur i optimitzat per SEO que serveix de base sòlida per qualsevol projecte web modern.