/**
 * Academic Personal Website - JavaScript
 * Handles navigation, scroll animations, and interactions
 */

// ============================================
// DOM Elements
// ============================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const fadeElements = document.querySelectorAll('.fade-in');

// ============================================
// Navigation Toggle (Desktop & Mobile)
// ============================================
function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !hamburger.contains(e.target) && 
        !navMenu.contains(e.target)) {
        toggleMenu();
    }
});

// ============================================
// Navbar Scroll Effect
// ============================================
let lastScrollY = window.scrollY;

function handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Add shadow when scrolled
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleScroll, { passive: true });

// ============================================
// Smooth Scroll for Navigation Links
// ============================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Scroll-triggered Fade-in Animation
// ============================================
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px', // Trigger when element is 100px from entering viewport
    threshold: 0.1
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optionally unobserve after animation triggers
            // observer.unobserve(entry.target);
        }
    });
};

const fadeObserver = new IntersectionObserver(observerCallback, observerOptions);

fadeElements.forEach(element => {
    fadeObserver.observe(element);
});

// ============================================
// Active Navigation Link Highlighting
// ============================================
const sections = document.querySelectorAll('.section');

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + navbar.offsetHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.style.color = 'var(--color-accent)';
                } else {
                    link.style.color = '';
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });

// ============================================
// Dynamic Last Updated Date
// ============================================
function updateLastUpdated() {
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        const now = new Date();
        const options = { year: 'numeric', month: 'long' };
        lastUpdatedElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

updateLastUpdated();

// ============================================
// Optional: Add subtle parallax effect to home section
// ============================================
const homeSection = document.querySelector('.home-section');

function handleParallax() {
    if (homeSection && window.innerWidth > 768) {
        const scrolled = window.scrollY;
        const homeHeight = homeSection.offsetHeight;
        
        if (scrolled < homeHeight) {
            const opacity = 1 - (scrolled / homeHeight) * 0.3;
            homeSection.style.opacity = opacity;
        }
    }
}

window.addEventListener('scroll', handleParallax, { passive: true });

// ============================================
// Keyboard Navigation Support
// ============================================
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMobileMenu();
        hamburger.focus();
    }
});

// ============================================
// Performance: Throttle scroll events
// ============================================
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function(...args) {
        const currentTime = Date.now();
        
        clearTimeout(timeoutId);
        
        if (currentTime - lastExecTime < delay) {
            timeoutId = setTimeout(() => {
                lastExecTime = currentTime;
                func.apply(this, args);
            }, delay);
        } else {
            lastExecTime = currentTime;
            func.apply(this, args);
        }
    };
}

// Throttled versions of scroll handlers
const throttledHandleScroll = throttle(handleScroll, 100);
const throttledUpdateActiveNavLink = throttle(updateActiveNavLink, 100);
const throttledHandleParallax = throttle(handleParallax, 100);

// Replace scroll listeners with throttled versions
window.removeEventListener('scroll', handleScroll);
window.removeEventListener('scroll', updateActiveNavLink);
window.removeEventListener('scroll', handleParallax);

window.addEventListener('scroll', throttledHandleScroll, { passive: true });
window.addEventListener('scroll', throttledUpdateActiveNavLink, { passive: true });
window.addEventListener('scroll', throttledHandleParallax, { passive: true });

// ============================================
// Console Welcome Message
// ============================================
console.log(`
╔═══════════════════════════════════════════╗
║   Academic Personal Website               ║
║   Built with HTML + CSS + JavaScript      ║
║                                           ║
║   Ready to deploy to GitHub Pages!        ║
╚═══════════════════════════════════════════╝
`);

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial scroll check for navbar
    handleScroll();
    
    // Check for elements already in viewport on load
    setTimeout(() => {
        fadeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9) {
                element.classList.add('visible');
            }
        });
    }, 100);
});
