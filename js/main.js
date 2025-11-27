/**
 * Jordan Prayer Times Website
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initCounterAnimation();
    initScrollAnimations();
    initHijriDate();
    initPrayerTimesPreview();
    updateYear();
});

/**
 * Navbar scroll effect
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Back to top button
 */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    const handleScroll = () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Counter animation for stats
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
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
    };

    // Use Intersection Observer for animation trigger
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/**
 * Scroll reveal animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(el => {
        el.classList.add('aos-init');
        observer.observe(el);
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .aos-init {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .aos-animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Hijri date calculation and display
 */
function initHijriDate() {
    const hijriDateEl = document.getElementById('hijriDate');
    if (!hijriDateEl) return;

    const hijriDate = getHijriDate(new Date());
    hijriDateEl.textContent = hijriDate;
}

/**
 * Convert Gregorian to Hijri date
 */
function getHijriDate(date) {
    const hijriMonths = [
        'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani',
        'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
        'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
    ];

    // Simple approximation algorithm
    const gregorianDate = new Date(date);
    const gregorianYear = gregorianDate.getFullYear();
    const gregorianMonth = gregorianDate.getMonth();
    const gregorianDay = gregorianDate.getDate();

    // Julian Day Number calculation
    let a = Math.floor((14 - (gregorianMonth + 1)) / 12);
    let y = gregorianYear + 4800 - a;
    let m = (gregorianMonth + 1) + 12 * a - 3;

    let jd = gregorianDay + Math.floor((153 * m + 2) / 5) + 365 * y +
             Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    // Convert Julian Day to Hijri
    let l = jd - 1948440 + 10632;
    let n = Math.floor((l - 1) / 10631);
    l = l - 10631 * n + 354;
    let j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
            Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
    l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
        Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    let hijriMonth = Math.floor((24 * l) / 709);
    let hijriDay = l - Math.floor((709 * hijriMonth) / 24);
    let hijriYear = 30 * n + j - 30;

    return `${hijriMonths[hijriMonth - 1]} ${hijriDay}, ${hijriYear} AH`;
}

/**
 * Update prayer times preview with current time highlighting
 */
function initPrayerTimesPreview() {
    const prayers = document.querySelectorAll('.preview-prayer');
    if (prayers.length === 0) return;

    // Sample prayer times (would be fetched from API in production)
    const prayerTimes = [
        { name: 'Fajr', hour: 5, minute: 23 },
        { name: 'Sunrise', hour: 6, minute: 45 },
        { name: 'Dhuhr', hour: 12, minute: 15 },
        { name: 'Asr', hour: 15, minute: 30 },
        { name: 'Maghrib', hour: 17, minute: 45 },
        { name: 'Isha', hour: 19, minute: 15 }
    ];

    const updateActiveprayer = () => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        let activeIndex = 0;
        for (let i = prayerTimes.length - 1; i >= 0; i--) {
            const prayerMinutes = prayerTimes[i].hour * 60 + prayerTimes[i].minute;
            if (currentMinutes >= prayerMinutes) {
                activeIndex = i;
                break;
            }
        }

        prayers.forEach((prayer, index) => {
            prayer.classList.toggle('active', index === activeIndex);
        });
    };

    updateActiveprayer();
    setInterval(updateActiveprayer, 60000); // Update every minute
}

/**
 * Update copyright year
 */
function updateYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

/**
 * Language toggle functionality with full translation
 */
function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    if (!langToggle) return;

    // Check for saved language preference
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    if (savedLang === 'ar') {
        setLanguage('ar');
    }

    langToggle.addEventListener('click', () => {
        const html = document.documentElement;
        const currentLang = html.getAttribute('data-lang') || 'en';
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
    });
}

/**
 * Set the website language
 */
function setLanguage(lang) {
    const html = document.documentElement;

    // Update HTML attributes
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    html.setAttribute('data-lang', lang);

    // Update toggle button text
    const langEn = document.querySelector('.lang-en');
    const langAr = document.querySelector('.lang-ar');
    if (langEn && langAr) {
        langEn.style.display = lang === 'en' ? 'inline' : 'none';
        langAr.style.display = lang === 'ar' ? 'inline' : 'none';
    }

    // Translate all elements with data-en and data-ar attributes
    const translatableElements = document.querySelectorAll('[data-en][data-ar]');
    translatableElements.forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            el.textContent = text;
        }
    });

    // Save preference
    localStorage.setItem('preferredLanguage', lang);

    // Update font for Arabic
    document.body.style.fontFamily = lang === 'ar'
        ? "'Amiri', 'Traditional Arabic', serif"
        : "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif";
}

// Initialize language toggle
initLanguageToggle();

/**
 * Image comparison slider (for version comparison)
 */
function initImageComparison() {
    const comparisons = document.querySelectorAll('.image-comparison');

    comparisons.forEach(comparison => {
        const slider = comparison.querySelector('.comparison-slider');
        const beforeImage = comparison.querySelector('.before-image');

        if (!slider || !beforeImage) return;

        let isSliding = false;

        const slide = (e) => {
            if (!isSliding) return;

            const rect = comparison.getBoundingClientRect();
            let x = e.clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));

            const percent = (x / rect.width) * 100;
            beforeImage.style.width = `${percent}%`;
            slider.style.left = `${percent}%`;
        };

        slider.addEventListener('mousedown', () => isSliding = true);
        document.addEventListener('mouseup', () => isSliding = false);
        document.addEventListener('mousemove', slide);

        // Touch support
        slider.addEventListener('touchstart', () => isSliding = true);
        document.addEventListener('touchend', () => isSliding = false);
        document.addEventListener('touchmove', (e) => {
            if (isSliding && e.touches[0]) {
                const touch = e.touches[0];
                slide({ clientX: touch.clientX });
            }
        });
    });
}

/**
 * Lazy loading for images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
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

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Initialize lazy loading
initLazyLoading();

/**
 * Parallax effect for hero section
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        hero.style.backgroundPositionY = `${rate}px`;
    }, { passive: true });
}

// Initialize parallax
initParallax();

/**
 * Handle store button clicks - track analytics
 */
document.querySelectorAll('.store-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const storeName = this.querySelector('.store-name')?.textContent || 'Unknown';
        console.log(`Store clicked: ${storeName}`);
        // Add analytics tracking here if needed
    });
});

/**
 * Animate elements when they come into view
 */
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .testimonial-card, .version-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations
animateOnScroll();

/**
 * Form validation (for contact form if added)
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Show notification toast
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: ${type === 'success' ? '#1a5f4a' : type === 'error' ? '#e74c3c' : '#333'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideUp 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast animations
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(100px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(100px); opacity: 0; }
    }
`;
document.head.appendChild(toastStyles);
