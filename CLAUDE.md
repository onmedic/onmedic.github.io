# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OnMedic is a multilingual static website for a healthcare technology company. The site is built with vanilla HTML, CSS, and JavaScript, optimized for performance and SEO, and deployed via GitHub Pages.

## Architecture

### Multilingual Structure
The site supports three languages with automatic detection and manual selection:
- **Catalan** (`/ca/`) - Primary target audience
- **Spanish** (`/es/`)
- **English** (`/en/`) - Default fallback

**Language Detection Flow:**
1. Root `index.html` redirects based on browser language preferences
2. Uses `localStorage` to remember user's language choice
3. Supports `?lang=XX` URL parameter for explicit language selection
4. Each language folder contains complete site pages: `index.html`, contact page, privacy, terms, cookies

### File Structure
```
/
├── index.html              # Language detection & redirect page
├── sw.js                   # Service Worker (PWA functionality)
├── sitemap.xml            # SEO sitemap with hreflang
├── robots.txt
├── /ca/, /es/, /en/       # Language-specific pages
├── /src/
│   ├── /styles/
│   │   ├── main.css / main.min.css
│   │   ├── contact.css / contact.min.css
│   │   └── critical.css            # Above-the-fold inline CSS
│   ├── /scripts/
│   │   ├── main.js / main.min.js
│   │   ├── animations.js / animations.min.js
│   │   └── analytics.js / analytics.min.js
│   └── /assets/images/
└── /build/                 # Build artifacts (if any)
```

### Performance Optimizations
- **Critical CSS** is inlined in `<style>` tags in each HTML page for above-the-fold rendering
- All CSS and JS have minified versions (`.min.css`, `.min.js`)
- Service Worker implements cache-first strategy for static resources, network-first for dynamic content
- DNS prefetch for external resources (Google Fonts, Analytics, Formspree)
- Lazy loading for images

### CSS Architecture
- Uses CSS custom properties (CSS variables) defined in `:root`
- Color scheme: Primary (#0A2342), Accent (#00D4FF), Secondary (#6C7293)
- Responsive design with mobile-first approach
- Typography: Space Grotesk (headings), Inter (body)
- **Important**: The expertise section had a backdrop-filter issue causing invisible text. This is now fixed by removing backdrop-filter and using solid background colors.

### JavaScript Components
- **main.js**: Navigation, scroll effects, mobile menu, cookie consent banner
- **animations.js**: Scroll-based animations, intersection observer effects
- **analytics.js**: Google Analytics 4 integration with GDPR compliance
  - Only activates when user accepts all cookies
  - Tracks language-specific events
  - Requires setting `GA_MEASUREMENT_ID` in the file

### Service Worker (PWA)
- Cache version: `v2.0.0-ULTRAFIX` (update this when making major changes)
- **Never caches** `index.html` to avoid serving stale redirects
- Static cache: CSS, JS, images, fonts
- Dynamic cache: HTML pages, API responses
- Includes offline fallback page

## Development Workflow

### Making Changes

1. **Edit source files** in language folders (`/ca/`, `/es/`, `/en/`)
2. **Update both regular and minified versions** of CSS/JS in `/src/`
3. **Update Service Worker version** in `sw.js` if changing cached resources
4. **Test language detection** by clearing localStorage and testing redirects
5. **Check all three languages** when making content changes

### SEO Considerations
- Each page must have proper `hreflang` tags pointing to all language versions
- Canonical URLs should point to the current language version
- Update `sitemap.xml` when adding new pages
- Structured data (JSON-LD) is included in HTML pages

### Analytics Setup
To activate Google Analytics:
1. Create GA4 property at analytics.google.com
2. Get Measurement ID (format: G-XXXXXXXXXX)
3. Edit `/src/scripts/analytics.js` and replace placeholder ID
4. Update `/src/scripts/analytics.min.js` with minified version
5. See `GOOGLE_ANALYTICS_SETUP.md` for detailed instructions

### Cookie Consent
- Cookie banner is managed in `main.js`
- Stores consent in localStorage as `cookieConsent`
- Analytics only loads when user accepts all cookies
- Essential cookies always allowed (language preference)

### Deployment
- Site deploys automatically via GitHub Pages on push to `main` branch
- Production URL: https://onmedic.com
- CNAME file points to custom domain
- `.nojekyll` file prevents Jekyll processing

## Common Tasks

### Adding a New Page
1. Create HTML file in all three language folders (`/ca/`, `/es/`, `/en/`)
2. Include proper hreflang tags
3. Link CSS: `/src/styles/main.min.css` or specific stylesheet
4. Link JS: `/src/scripts/main.min.js` and any needed scripts
5. Update `sitemap.xml` with new URLs and hreflang references
6. Update navigation in all language versions

### Updating Styles
1. Edit source CSS file in `/src/styles/`
2. Create minified version with same name + `.min.css`
3. If changing critical CSS, update inline `<style>` blocks in HTML pages
4. Increment Service Worker cache version in `sw.js`

### Updating Scripts
1. Edit source JS file in `/src/scripts/`
2. Create minified version with same name + `.min.js`
3. Test in all three language versions
4. Increment Service Worker cache version in `sw.js`

### Fixing Cache Issues
If users see old content after updates:
1. Increment cache version constants in `sw.js` (e.g., `v2.0.0` → `v2.0.1`)
2. Service Worker will automatically delete old caches on activation
3. Service Worker sends reload message to open tabs

### Testing Language Detection
1. Clear browser localStorage
2. Navigate to root `/` or `index.html`
3. Check browser console for language detection logs
4. Verify redirect to correct language folder
5. Test manual language selection links
6. Test `?lang=XX` URL parameter

## Important Notes

- **Never cache `index.html`** in Service Worker - it's a redirect page
- **All content changes** must be replicated across all three language folders
- **Critical CSS** must match the full CSS to avoid FOUC (Flash of Unstyled Content)
- **Backdrop-filter** has been removed from expertise cards to fix text visibility
- **Service Worker version** must be updated when cached resources change
- **Analytics requires manual configuration** of Measurement ID before use
- Site is optimized for Lighthouse scores 95+ and WCAG 2.1 AA accessibility
