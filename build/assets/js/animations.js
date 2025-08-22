// OnMedic Advanced Animations
// Hero animations, scroll effects and visual enhancements

'use strict';

document.addEventListener('DOMContentLoaded', function() {
    initHeroAnimation();
    initScrollAnimations();
    initParallaxEffects();
    initCounterAnimations();
});

/**
 * Hero section neural network animation
 */
function initHeroAnimation() {
    const canvas = document.getElementById('hero-animation');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let connections = [];
    
    // Set up canvas
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    // Particle class for neural network nodes
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 2;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.8 + 0.2;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulse = 0;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulse += this.pulseSpeed;
            
            // Boundary checks
            if (this.x < 0 || this.x > canvas.offsetWidth) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.offsetHeight) this.speedY *= -1;
            
            // Keep within bounds
            this.x = Math.max(0, Math.min(canvas.offsetWidth, this.x));
            this.y = Math.max(0, Math.min(canvas.offsetHeight, this.y));
        }
        
        draw() {
            const pulseSize = this.size + Math.sin(this.pulse) * 1;
            const pulseOpacity = this.opacity + Math.sin(this.pulse) * 0.3;
            
            ctx.globalAlpha = pulseOpacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
            ctx.fillStyle = '#00D4FF';
            ctx.fill();
            
            // Glow effect
            ctx.globalAlpha = pulseOpacity * 0.3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, pulseSize * 2, 0, Math.PI * 2);
            ctx.fillStyle = '#00D4FF';
            ctx.fill();
        }
    }
    
    // Initialize particles
    function initParticles() {
        particles = [];
        const particleCount = Math.min(50, Math.floor(canvas.offsetWidth / 20));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(
                Math.random() * canvas.offsetWidth,
                Math.random() * canvas.offsetHeight
            ));
        }
    }
    
    // Draw connections between nearby particles
    function drawConnections() {
        const maxDistance = 120;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.4;
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    gradient.addColorStop(0, `rgba(0, 212, 255, ${opacity})`);
                    gradient.addColorStop(0.5, `rgba(0, 212, 255, ${opacity * 0.5})`);
                    gradient.addColorStop(1, `rgba(0, 212, 255, ${opacity})`);
                    
                    ctx.globalAlpha = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        drawConnections();
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Initialize
    resizeCanvas();
    initParticles();
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
    
    // Pause animation when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animate();
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        });
    });
    
    observer.observe(canvas);
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    if (!window.IntersectionObserver) return;
    
    const animatedElements = document.querySelectorAll('[data-aos]');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.getAttribute('data-aos');
                const delay = element.getAttribute('data-aos-delay') || 0;
                
                setTimeout(() => {
                    element.classList.add('aos-animate');
                    
                    // Apply specific animation
                    switch(animationType) {
                        case 'fade-up':
                            element.style.animation = 'fadeInUp 0.8s ease forwards';
                            break;
                        case 'zoom-in':
                            element.style.animation = 'zoomIn 0.6s ease forwards';
                            break;
                        case 'slide-left':
                            element.style.animation = 'slideInLeft 0.8s ease forwards';
                            break;
                    }
                }, delay);
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = getInitialTransform(element.getAttribute('data-aos'));
        observer.observe(element);
    });
    
    function getInitialTransform(animationType) {
        switch(animationType) {
            case 'fade-up':
                return 'translateY(30px)';
            case 'zoom-in':
                return 'scale(0.8)';
            case 'slide-left':
                return 'translateX(-30px)';
            default:
                return 'none';
        }
    }
}

/**
 * Parallax scrolling effects
 */
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.tech-logos, .neural-network');
    
    if (parallaxElements.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    let ticking = false;
    
    function updateParallax() {
        const scrollY = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const speed = 0.5 - (index * 0.1); // Different speeds for variety
            
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                const yPos = -(scrollY * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

/**
 * Counter animations for statistics (if needed)
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    
    if (counters.length === 0 || !window.IntersectionObserver) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

/**
 * Mouse interaction effects
 */
function initMouseEffects() {
    const interactiveCards = document.querySelectorAll('.feature-card, .expertise-card, .sector-card');
    
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // 3D tilt effect on mouse move
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `
                translateY(-8px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale(1.02)
            `;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    /* Reduce animations for users who prefer reduced motion */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);

// Initialize mouse effects after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Delay mouse effects to ensure all elements are rendered
    setTimeout(initMouseEffects, 100);
});