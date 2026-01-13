/* ===================================
   BRIDGP DYNAMICS - COMPLETE JAVASCRIPT
   All Features Working Perfectly
   =================================== */

// === WAIT FOR PAGE TO LOAD ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 BRIDGP DYNAMICS Loading...');
    
    // Initialize all features
    initSmoothScroll();
    initMobileMenu();
    initNavbar();
    initScrollAnimations();
    initContactForm();
    initServiceCards();
    initScrollToTop();
    initAccessibility();
    
    console.log('✅ Website fully loaded!');
});

// === SMOOTH SCROLL FOR ALL LINKS ===
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#' || !targetId) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbar = document.getElementById('navbar');
                const navHeight = navbar ? navbar.offsetHeight : 70;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const menuToggle = document.getElementById('menuToggle');
                const navMenu = document.getElementById('navMenu');
                if (menuToggle && navMenu) {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const navbar = document.getElementById('navbar');
                const navHeight = navbar ? navbar.offsetHeight : 70;
                window.scrollTo({
                    top: aboutSection.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// === MOBILE MENU ===
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!menuToggle || !navMenu) return;
    
    // Toggle menu
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close on nav link click
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// === NAVBAR EFFECTS ===
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Animate cards and sections
    const animateElements = document.querySelectorAll(
        '.about-card, .service-card, .why-us-item, .contact-item, .section-header'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// === CONTACT FORM - GMAIL & WHATSAPP ===
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validate required fields
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all required fields', 'error');
            return false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // WhatsApp number
        const whatsappNumber = '94770114515'; // +94 77 011 4515
        
        // Create WhatsApp message
        const whatsappMessage = `*New Contact from bridgp.com*%0A%0A` +
            `*Name:* ${encodeURIComponent(name)}%0A` +
            `*Email:* ${encodeURIComponent(email)}%0A` +
            `*Phone:* ${encodeURIComponent(phone || 'Not provided')}%0A` +
            `*Subject:* ${encodeURIComponent(subject)}%0A%0A` +
            `*Message:*%0A${encodeURIComponent(message)}`;
        
        // Create Gmail compose link
        const gmailSubject = `Contact Form: ${subject} - From ${name}`;
        const gmailBody = `New contact form submission from bridgp.com%0D%0A%0D%0A` +
            `Name: ${name}%0D%0A` +
            `Email: ${email}%0D%0A` +
            `Phone: ${phone || 'Not provided'}%0D%0A` +
            `Subject: ${subject}%0D%0A%0D%0A` +
            `Message:%0D%0A${message}%0D%0A%0D%0A` +
            `----%0D%0ASent from bridgp.com contact form`;
        
        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=info@bridgp.com&su=${encodeURIComponent(gmailSubject)}&body=${gmailBody}`;
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
        
        // Open WhatsApp
        window.open(whatsappLink, '_blank');
        
        // Open Gmail compose after short delay
        setTimeout(() => {
            window.open(gmailLink, '_blank');
        }, 800);
        
        // Show success message
        showNotification('Opening WhatsApp and Gmail...', 'success');
        
        // Reset form
        setTimeout(() => {
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateInput(this);
            }
        });
    });
}

// Validate individual input
function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    
    // Check required fields
    if (input.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    // Check email format
    if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
        }
    }
    
    // Visual feedback
    if (isValid) {
        input.classList.remove('error');
        input.style.borderColor = 'rgba(37, 99, 235, 0.3)';
    } else {
        input.classList.add('error');
        input.style.borderColor = '#ef4444';
    }
    
    return isValid;
}

// === NOTIFICATION SYSTEM ===
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.custom-notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '90px',
        right: '20px',
        padding: '18px 28px',
        background: type === 'success' 
            ? 'linear-gradient(135deg, #2563eb, #3b82f6)' 
            : 'linear-gradient(135deg, #ef4444, #dc2626)',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
        zIndex: '10000',
        fontSize: '15px',
        fontWeight: '500',
        maxWidth: '90%',
        animation: 'slideIn 0.5s ease',
        lineHeight: '1.5'
    });
    
    // Add animation styles
    if (!document.querySelector('#notificationAnim')) {
        const style = document.createElement('style');
        style.id = 'notificationAnim';
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
    
    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// === SERVICE CARDS ===
function initServiceCards() {
    // Make toggleService function available globally
    window.toggleService = function(button) {
        const card = button.closest('.service-card');
        const details = card.querySelector('.service-details');
        const isActive = details.classList.contains('active');
        
        // Close all others
        document.querySelectorAll('.service-details').forEach(d => {
            d.classList.remove('active');
        });
        document.querySelectorAll('.expand-btn').forEach(b => {
            b.classList.remove('active');
        });
        
        // Toggle current
        if (!isActive) {
            details.classList.add('active');
            button.classList.add('active');
            
            // Smooth scroll to show content
            setTimeout(() => {
                const cardTop = card.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({
                    top: cardTop,
                    behavior: 'smooth'
                });
            }, 300);
        }
    };
}

// === SCROLL TO TOP BUTTON ===
function initScrollToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.className = 'scroll-top-btn';
    
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
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
        transition: 'all 0.3s ease',
        zIndex: '998',
        boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    });
    
    document.body.appendChild(btn);
    
    // Show/hide on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
        }
    });
    
    // Click to scroll top
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Hover effects
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-5px) scale(1.1)';
        btn.style.boxShadow = '0 8px 30px rgba(37, 99, 235, 0.6)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0) scale(1)';
        btn.style.boxShadow = '0 4px 20px rgba(37, 99, 235, 0.4)';
    });
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
    
    // Add focus styles
    if (!document.querySelector('#a11yStyles')) {
        const style = document.createElement('style');
        style.id = 'a11yStyles';
        style.textContent = `
            .keyboard-nav *:focus {
                outline: 3px solid #2563eb !important;
                outline-offset: 3px !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// === LAZY LOAD IMAGES ===
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
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// === UTILITY FUNCTIONS ===
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

console.log('✨ BRIDGP DYNAMICS - Fully Loaded & Ready!');