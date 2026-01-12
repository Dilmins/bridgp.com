/* ===================================
   BRIDGP DYNAMICS - PROFESSIONAL JAVASCRIPT
   Complete Interactive Experience
   =================================== */

// === UNIVERSAL SMOOTH SCROLL FUNCTION ===
function smoothScrollTo(element, offset = 80) {
    if (!element) return;
    
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// === INITIALIZE ON PAGE LOAD ===
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initMobileMenu();
    initNavbarEffects();
    initScrollAnimations();
    initFormValidation();
    initServiceCards();
    initParallaxEffects();
    initScrollToTop();
    initAccessibility();
    initPreloader();
});

// === SMOOTH SCROLL FOR ALL LINKS ===
function initSmoothScroll() {
    // All anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                smoothScrollTo(targetElement);
                
                // Close mobile menu
                const menuToggle = document.getElementById('menuToggle');
                const navMenu = document.getElementById('navMenu');
                menuToggle?.classList.remove('active');
                navMenu?.classList.remove('active');
                
                // Update active state
                updateActiveNavLink(targetId);
            }
        });
    });
    
    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            smoothScrollTo(aboutSection);
        });
    }
    
    // Make ALL cards clickable and scroll to their sections
    initClickableCards();
}

// === MAKE CARDS CLICKABLE FOR SMOOTH SCROLLING ===
function initClickableCards() {
    // About cards - click to scroll to services
    document.querySelectorAll('.about-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on a link inside
            if (e.target.tagName !== 'A') {
                const servicesSection = document.getElementById('services');
                smoothScrollTo(servicesSection);
            }
        });
    });
    
    // Service cards - already have expand functionality, but clicking title scrolls to contact
    document.querySelectorAll('.service-card h3').forEach(title => {
        title.style.cursor = 'pointer';
        title.addEventListener('click', function() {
            const contactSection = document.getElementById('contact');
            smoothScrollTo(contactSection);
        });
    });
    
    // Why Us cards - click to scroll to contact
    document.querySelectorAll('.why-us-item').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            const contactSection = document.getElementById('contact');
            smoothScrollTo(contactSection);
        });
    });
    
    // Contact info items - smooth scroll within page
    document.querySelectorAll('.contact-item').forEach(item => {
        item.style.cursor = 'pointer';
    });
    
    // Footer links - smooth scroll
    document.querySelectorAll('.footer-section a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                smoothScrollTo(targetElement);
            }
        });
    });
}

// === UPDATE ACTIVE NAV LINK ===
function updateActiveNavLink(targetId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// === MOBILE MENU ===
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// === NAVBAR EFFECTS ===
function initNavbarEffects() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    let lastScroll = 0;
    
    window.addEventListener('scroll', debounce(() => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class
        if (currentScroll > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        lastScroll = currentScroll;
    }, 10));
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animateElements = document.querySelectorAll(
        '.about-card, .service-card, .why-us-item, .contact-item, .section-header'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        observer.observe(el);
    });
}

// === SERVICE CARDS EXPAND/COLLAPSE ===
function initServiceCards() {
    window.toggleService = function(button) {
        const serviceCard = button.closest('.service-card');
        const details = serviceCard.querySelector('.service-details');
        const allDetails = document.querySelectorAll('.service-details');
        const allButtons = document.querySelectorAll('.expand-btn');
        const isActive = details.classList.contains('active');
        
        // Close all
        allDetails.forEach(d => d.classList.remove('active'));
        allButtons.forEach(b => b.classList.remove('active'));
        
        // Open clicked one if it wasn't active
        if (!isActive) {
            details.classList.add('active');
            button.classList.add('active');
            
            // Smooth scroll to show expanded content
            setTimeout(() => {
                const cardTop = serviceCard.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({
                    top: cardTop,
                    behavior: 'smooth'
                });
            }, 100);
        }
    };
}

// === FORM VALIDATION & SUBMISSION ===
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Show loading state
            const submitBtn = contactForm.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate sending (replace with actual API call)
            setTimeout(() => {
                showNotification('Thank you! We will get back to you soon.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Scroll to top smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1500);
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
        }
    }
    
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
        }
    }
    
    if (isValid) {
        field.classList.remove('error');
        field.style.borderColor = 'rgba(37, 99, 235, 0.5)';
    } else {
        field.classList.add('error');
        field.style.borderColor = '#ef4444';
    }
    
    return isValid;
}

// === NOTIFICATION SYSTEM ===
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '24px',
        padding: '18px 28px',
        background: type === 'success' 
            ? 'linear-gradient(135deg, #2563eb, #3b82f6)' 
            : 'linear-gradient(135deg, #ef4444, #dc2626)',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
        zIndex: '10000',
        animation: 'slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        fontSize: '15px',
        fontWeight: '500',
        maxWidth: '400px'
    });
    
    if (!document.querySelector('#notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// === SCROLL TO TOP BUTTON ===
function initScrollToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.setAttribute('aria-label', 'Scroll to top');
    
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        width: '56px',
        height: '56px',
        background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        fontSize: '20px',
        cursor: 'pointer',
        opacity: '0',
        visibility: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: '999',
        boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)'
    });
    
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', debounce(() => {
        if (window.pageYOffset > 400) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
        }
    }, 10));
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-8px) scale(1.1)';
        btn.style.boxShadow = '0 12px 32px rgba(37, 99, 235, 0.6)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0) scale(1)';
        btn.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.4)';
    });
}

// === PARALLAX EFFECTS ===
function initParallaxEffects() {
    window.addEventListener('scroll', debounce(() => {
        const scrolled = window.pageYOffset;
        
        // Hero parallax
        const heroBg = document.querySelector('.hero::before');
        if (heroBg) {
            document.querySelector('.hero').style.setProperty('--scroll', scrolled * 0.5 + 'px');
        }
        
        // Section backgrounds
        document.querySelectorAll('.about::before, .services::before, .contact::before').forEach(el => {
            if (el) {
                const rect = el.closest('section').getBoundingClientRect();
                const offset = (window.innerHeight - rect.top) * 0.1;
                el.style.transform = `translateY(${offset}px)`;
            }
        });
    }, 10));
}

// === ACCESSIBILITY ===
function initAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
    
    // Focus styles
    if (!document.querySelector('#a11yStyles')) {
        const style = document.createElement('style');
        style.id = 'a11yStyles';
        style.textContent = `
            .keyboard-nav *:focus {
                outline: 3px solid #2563eb !important;
                outline-offset: 3px !important;
            }
            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#about';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    Object.assign(skipLink.style, {
        position: 'absolute',
        top: '-100px',
        left: '20px',
        background: '#2563eb',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        zIndex: '10001',
        transition: 'top 0.3s'
    });
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '20px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-100px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// === PRELOADER ===
function initPreloader() {
    // Create preloader
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    Object.assign(preloader.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '10000',
        transition: 'opacity 0.5s ease'
    });
    
    preloader.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 60px; height: 60px; border: 3px solid rgba(37, 99, 235, 0.3); border-top-color: #2563eb; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </div>
    `;
    
    const spinStyle = document.createElement('style');
    spinStyle.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinStyle);
    
    document.body.appendChild(preloader);
    
    // Remove preloader when page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }, 500);
    });
}

// === UTILITY: DEBOUNCE ===
function debounce(func, wait) {
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

// === LAZY LOADING IMAGES ===
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// === PERFORMANCE MONITORING ===
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.duration > 100) {
                console.warn('Long task detected:', entry.duration + 'ms');
            }
        }
    });
    
    try {
        perfObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
        // Long task monitoring not supported
    }
}

// === EASTER EGG: KONAMI CODE ===
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showNotification('🎉 You found the secret! Welcome to BRIDGP DYNAMICS!', 'success');
        document.body.style.animation = 'rainbow 2s linear';
        
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(rainbowStyle);
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

console.log('🚀 BRIDGP DYNAMICS - Fully Loaded & Optimized!');