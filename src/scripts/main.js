// OnMedic Main JavaScript
// Modern healthcare technology website interactions

'use strict';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initSmoothScroll();
    initScrollEffects();
    initFormHandling();
    initPerformanceOptimizations();
    initAccessibility();
});

/**
 * Smooth scroll for navigation links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Track navigation clicks
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        event_category: 'Navigation',
                        event_label: targetId
                    });
                }
            }
        });
    });
}

/**
 * Header scroll effects and scroll progress
 */
function initScrollEffects() {
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');
    let lastScrollY = window.scrollY;
    
    // Create scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--color-accent), var(--color-primary));
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Header background opacity (mantenir blanc)
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(10, 35, 66, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(10, 35, 66, 0.06)';
        }
        
        // Scroll progress
        const scrollProgress = (currentScrollY / documentHeight) * 100;
        progressBar.style.width = `${Math.min(scrollProgress, 100)}%`;
        
        // Keep header visible always for better navigation
        header.style.transform = 'translateY(0)';
        
        lastScrollY = currentScrollY;
    }
    
    // Throttled scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(handleScroll);
    }, { passive: true });
}

/**
 * Enhanced form handling with validation
 */
function initFormHandling() {
    const form = document.querySelector('.contact-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearErrors);
    });
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing error styling
        field.classList.remove('error');
        
        // Validation rules
        if (field.required && !value) {
            showFieldError(field, 'Aquest camp és obligatori');
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                showFieldError(field, 'Introduïu un email vàlid');
                return false;
            }
        }
        
        return true;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        
        // Add error styles if not already defined
        if (!document.querySelector('.error-styles')) {
            const style = document.createElement('style');
            style.className = 'error-styles';
            style.textContent = `
                .form-group input.error,
                .form-group textarea.error {
                    border-color: #ff6b6b;
                    box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function clearErrors(e) {
        e.target.classList.remove('error');
    }
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            return;
        }
        
        // Update button state
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span>Enviant...</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="m12 1 0 6m0 6 0 6m-6-6 6 0m6 0-6 0"/>
            </svg>
        `;
        
        try {
            // Submit form via Formspree
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showSuccessMessage();
                form.reset();
                
                // Track successful submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        event_category: 'Contact',
                        event_label: 'Success'
                    });
                }
            } else {
                throw new Error('Error en enviar el formulari');
            }
        } catch (error) {
            showErrorMessage();
            console.error('Form submission error:', error);
            
            // Track error
            if (typeof gtag !== 'undefined') {
                gtag('event', 'exception', {
                    description: 'Form submission error',
                    fatal: false
                });
            }
        } finally {
            // Restore button
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }, 2000);
        }
    });
    
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'form-message success';
        message.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        message.innerHTML = '✅ Missatge enviat correctament! Ens posarem en contacte aviat.';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 5000);
    }
    
    function showErrorMessage() {
        const message = document.createElement('div');
        message.className = 'form-message error';
        message.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: #ef4444;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(239, 68, 68, 0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        message.innerHTML = '❌ Error en enviar el missatge. Torneu-ho a provar.';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 5000);
    }
}

/**
 * Performance optimizations
 */
function initPerformanceOptimizations() {
    // Lazy loading for images (if any are added later)
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Preload critical resources
    const criticalResources = [
        '/src/styles/main.css',
        '/src/scripts/animations.js'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
    });
}

/**
 * Accessibility enhancements
 */
function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.className = 'skip-link';
    skipLink.href = '#hero';
    skipLink.textContent = 'Anar al contingut principal';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Focus management for modal-like elements
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals or overlays if implemented
            const activeElement = document.activeElement;
            if (activeElement && activeElement.blur) {
                activeElement.blur();
            }
        }
    });
    
    // Announce dynamic content changes to screen readers
    window.announceToScreenReader = function(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    };
}

// Add CSS animations for form messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);