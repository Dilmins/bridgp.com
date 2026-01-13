/* ===================================
   BRIDGP - JAVASCRIPT FUNCTIONALITY
   =================================== */

// === SMOOTH SCROLL POLYFILL ===
// Enhanced smooth scroll for all browsers
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Don't scroll if it's just "#"
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                // Smooth scroll with custom animation
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                
                // Update active link
                updateActiveLink(targetId);
            }
        });
    });
});

// === UPDATE ACTIVE LINK ===
function updateActiveLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// === MOBILE MENU TOGGLE ===
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// === NAVBAR SCROLL EFFECT ===
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// === ACTIVE NAV LINK ON SCROLL ===
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    const navHeight = navbar.offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - navHeight - 100) {
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

// === SCROLL INDICATOR CLICK ===
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = aboutSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
}

// === SERVICE CARD EXPAND/COLLAPSE ===
function toggleService(button) {
    const serviceCard = button.closest('.service-card');
    const details = serviceCard.querySelector('.service-details');
    const isActive = details.classList.contains('active');

    // Close all other expanded services
    document.querySelectorAll('.service-details').forEach(detail => {
        detail.classList.remove('active');
    });
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Toggle current service
    if (!isActive) {
        details.classList.add('active');
        button.classList.add('active');
    }
}

// === SCROLL ANIMATIONS ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.about-card, .service-card, .why-us-item, .contact-item');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// === CONTACT FORM HANDLING ===
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Basic validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Simulate form submission
    showNotification('Thank you! Your message has been sent successfully.', 'success');
    contactForm.reset();

    // In production, you would send this data to a server
    // Example using fetch:
    /*
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, subject, message })
    })
    .then(response => response.json())
    .then(data => {
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
    })
    .catch(error => {
        showNotification('Oops! Something went wrong. Please try again.', 'error');
    });
    */
});

// === NOTIFICATION SYSTEM ===
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '16px 24px',
        backgroundColor: type === 'success' ? '#2563eb' : '#ef4444',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        zIndex: '9999',
        animation: 'slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        fontWeight: '500',
        maxWidth: '400px',
        fontSize: '15px'
    });

    // Add animation keyframes
    if (!document.querySelector('#notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
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
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// === SCROLL TO TOP BUTTON ===
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
Object.assign(scrollTopBtn.style, {
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
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: '999',
    boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)'
});

document.body.appendChild(scrollTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

// Scroll to top functionality
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Hover effect for scroll to top button
scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'translateY(-5px) scale(1.05)';
    scrollTopBtn.style.boxShadow = '0 8px 30px rgba(37, 99, 235, 0.6)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'translateY(0) scale(1)';
    scrollTopBtn.style.boxShadow = '0 4px 20px rgba(37, 99, 235, 0.4)';
});

// === LAZY LOADING FOR IMAGES ===
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// === ACCESSIBILITY ENHANCEMENTS ===
// Add focus visible class for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Add focus styles
const style = document.createElement('style');
style.textContent = `
    .keyboard-nav *:focus {
        outline: 2px solid #2563eb !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(style);

// === PERFORMANCE OPTIMIZATION ===
// Debounce function for scroll events
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

// === PARALLAX EFFECT (OPTIONAL) ===
window.addEventListener('scroll', debounce(() => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero::before, .about::before, .services::before');
    
    parallaxElements.forEach(el => {
        if (el) {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });
}, 10));

console.log('BRIDGP DYNAMICS website loaded successfully! 🚀');