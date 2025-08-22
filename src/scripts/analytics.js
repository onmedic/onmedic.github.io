/**
 * Google Analytics 4 Implementation with Language Detection
 * Optimized for OnMedic multi-language website
 * GDPR compliant with cookie consent integration
 */

class OnMedicAnalytics {
    constructor(measurementId) {
        this.measurementId = measurementId;
        this.isInitialized = false;
        this.currentLanguage = this.detectLanguage();
        this.cookieConsent = this.getCookieConsent();
    }

    /**
     * Detects current page language from HTML lang attribute
     * @returns {string} Language code (ca, es, en)
     */
    detectLanguage() {
        const htmlLang = document.documentElement.lang;
        const validLangs = ['ca', 'es', 'en'];
        return validLangs.includes(htmlLang) ? htmlLang : 'en';
    }

    /**
     * Gets cookie consent status from localStorage
     * @returns {string|null} 'all', 'essential', or null
     */
    getCookieConsent() {
        return localStorage.getItem('cookieConsent');
    }

    /**
     * Initializes Google Analytics if consent is given
     */
    init() {
        // Only initialize if user has consented to all cookies (including analytics)
        if (this.cookieConsent === 'all') {
            this.loadGoogleAnalytics();
        }
        
        // Listen for cookie consent changes
        this.setupConsentListener();
    }

    /**
     * Dynamically loads Google Analytics script
     */
    loadGoogleAnalytics() {
        if (this.isInitialized) return;

        // Create and load gtag script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        window.gtag = gtag;

        // Configure Google Analytics
        gtag('js', new Date());
        gtag('config', this.measurementId, {
            // Privacy-focused configuration
            anonymize_ip: true,
            cookie_expires: 63072000, // 2 years in seconds
            cookie_update: true,
            cookie_flags: 'SameSite=Lax;Secure',
            
            // Language and content grouping
            custom_map: {
                'custom_parameter_1': 'language',
                'custom_parameter_2': 'page_type'
            },
            
            // Enhanced ecommerce and user engagement
            allow_ad_personalization_signals: false,
            allow_google_signals: false,
            
            // Page-specific data
            page_title: document.title,
            page_location: window.location.href,
            language: this.currentLanguage,
            content_group1: this.currentLanguage,
            content_group2: this.getPageType()
        });

        // Track initial page view with language
        this.trackPageView();

        this.isInitialized = true;
        console.log(`🔍 Google Analytics initialized for language: ${this.currentLanguage}`);
    }

    /**
     * Determines page type for better analytics categorization
     * @returns {string} Page type
     */
    getPageType() {
        const path = window.location.pathname;
        
        if (path.includes('contact')) return 'contact';
        if (path.includes('privacy') || path.includes('privacitat') || path.includes('privacidad')) return 'privacy';
        if (path.includes('terms') || path.includes('termes') || path.includes('terminos')) return 'terms';
        if (path.includes('cookies')) return 'cookies';
        if (path === '/' || path.includes('index')) return 'home';
        
        return 'page';
    }

    /**
     * Tracks page view with enhanced data
     */
    trackPageView() {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            language: this.currentLanguage,
            content_group1: this.currentLanguage,
            content_group2: this.getPageType(),
            custom_parameter_1: this.currentLanguage,
            custom_parameter_2: this.getPageType()
        });
    }

    /**
     * Tracks custom events
     * @param {string} eventName - Name of the event
     * @param {Object} parameters - Event parameters
     */
    trackEvent(eventName, parameters = {}) {
        if (typeof gtag === 'undefined' || this.cookieConsent !== 'all') return;

        const enhancedParams = {
            language: this.currentLanguage,
            page_type: this.getPageType(),
            ...parameters
        };

        gtag('event', eventName, enhancedParams);
    }

    /**
     * Tracks form submissions
     * @param {string} formType - Type of form (contact, newsletter, etc.)
     */
    trackFormSubmission(formType) {
        this.trackEvent('form_submit', {
            event_category: 'Form',
            event_label: formType,
            form_type: formType
        });
    }

    /**
     * Tracks navigation clicks
     * @param {string} linkText - Text of the clicked link
     * @param {string} destination - Destination URL or section
     */
    trackNavigation(linkText, destination) {
        this.trackEvent('click', {
            event_category: 'Navigation',
            event_label: linkText,
            link_text: linkText,
            destination: destination
        });
    }

    /**
     * Tracks language changes
     * @param {string} fromLang - Previous language
     * @param {string} toLang - New language
     */
    trackLanguageChange(fromLang, toLang) {
        this.trackEvent('language_change', {
            event_category: 'User Interaction',
            event_label: `${fromLang} to ${toLang}`,
            previous_language: fromLang,
            new_language: toLang
        });
    }

    /**
     * Sets up listener for cookie consent changes
     */
    setupConsentListener() {
        // Listen for changes in localStorage (cookie consent)
        window.addEventListener('storage', (e) => {
            if (e.key === 'cookieConsent') {
                this.cookieConsent = e.newValue;
                
                if (e.newValue === 'all' && !this.isInitialized) {
                    this.loadGoogleAnalytics();
                }
            }
        });

        // Also check for direct changes (same page updates)
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            if (key === 'cookieConsent') {
                window.onMedicAnalytics.cookieConsent = value;
                if (value === 'all' && !window.onMedicAnalytics.isInitialized) {
                    window.onMedicAnalytics.loadGoogleAnalytics();
                }
            }
            originalSetItem.apply(this, arguments);
        };
    }

    /**
     * Manually triggers analytics loading (for use after user consent)
     */
    enableAnalytics() {
        if (!this.isInitialized) {
            this.cookieConsent = 'all';
            this.loadGoogleAnalytics();
        }
    }

    /**
     * Disables analytics and clears data
     */
    disableAnalytics() {
        this.isInitialized = false;
        this.cookieConsent = 'essential';
        
        if (typeof gtag !== 'undefined') {
            // Disable Google Analytics
            gtag('config', this.measurementId, {
                send_page_view: false
            });
        }
    }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Replace 'GA_MEASUREMENT_ID' with your actual Google Analytics 4 Measurement ID
    const GA_MEASUREMENT_ID = 'G-1JMY77EBP0'; // Your OnMedic Analytics ID
    
    window.onMedicAnalytics = new OnMedicAnalytics(GA_MEASUREMENT_ID);
    window.onMedicAnalytics.init();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OnMedicAnalytics;
}