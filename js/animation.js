/**
 * Animation functionality using GSAP
 */

/**
 * Initialize animations for the website
 */
export function initializeAnimations() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP library not loaded. Animations will not work.');
        fallbackAnimations();
        return;
    }
    
    // Initialize animations based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Register ScrollTrigger plugin if available
    if (gsap.ScrollTrigger) {
        gsap.registerPlugin(gsap.ScrollTrigger);
    }
    
    // Common animations for all pages
    initCommonAnimations();
    
    // Page-specific animations
    switch (currentPage) {
        case 'index.html':
            initHomePageAnimations();
            break;
        case 'projects.html':
            initProjectsPageAnimations();
            break;
        case 'about.html':
            initAboutPageAnimations();
            break;
        case 'blog.html':
            initBlogPageAnimations();
            break;
        case 'contact.html':
            initContactPageAnimations();
            break;
    }
    
    // Initialize scroll animations
    initScrollAnimations();
}

/**
 * Initialize common animations for all pages
 */
function initCommonAnimations() {
    // Header animation
    gsap.from('header', { 
        y: -50, 
        opacity: 0, 
        duration: 0.5, 
        ease: 'power2.out' 
    });
    
    // Footer animation
    gsap.from('footer', { 
        y: 50, 
        opacity: 0, 
        duration: 0.5, 
        delay: 0.5, 
        ease: 'power2.out' 
    });
}

/**
 * Initialize home page specific animations
 */
function initHomePageAnimations() {
    // Hero section animation
    gsap.from('#hero h1', { 
        opacity: 0, 
        y: 30, 
        duration: 0.8, 
        delay: 0.2, 
        ease: 'power3.out' 
    });
    
    gsap.from('#hero p', { 
        opacity: 0, 
        y: 20, 
        duration: 0.8, 
        delay: 0.4, 
        ease: 'power3.out' 
    });
    
    gsap.from('#hero a', { 
        opacity: 0, 
        y: 20, 
        duration: 0.8, 
        delay: 0.6, 
        stagger: 0.2, 
        ease: 'power3.out' 
    });
    
    // Staggered animations for featured projects and blog posts
    if (gsap.ScrollTrigger) {
        gsap.from('#featured-projects .project-card', {
            scrollTrigger: {
                trigger: '#featured-projects',
                start: 'top 80%'
            },
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power2.out'
        });
        
        gsap.from('#recent-blogs .blog-card', {
            scrollTrigger: {
                trigger: '#recent-blogs',
                start: 'top 80%'
            },
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power2.out'
        });
    }
}

/**
 * Initialize projects page specific animations
 */
function initProjectsPageAnimations() {
    // Filter buttons animation
    gsap.from('.filter-btn', { 
        opacity: 0, 
        y: 20, 
        duration: 0.5, 
        stagger: 0.1, 
        ease: 'power2.out' 
    });
    
    // Project cards animation
    if (gsap.ScrollTrigger) {
        gsap.from('#projects-grid .project-card', {
            scrollTrigger: {
                trigger: '#projects-grid',
                start: 'top 80%'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        });
    } else {
        gsap.from('#projects-grid .project-card', { 
            opacity: 0, 
            y: 30, 
            duration: 0.6, 
            stagger: 0.1, 
            delay: 0.5, 
            ease: 'power2.out' 
        });
    }
}

/**
 * Initialize about page specific animations
 */
function initAboutPageAnimations() {
    // Profile section animation
    gsap.from('#profile-image', { 
        opacity: 0, 
        scale: 0.8, 
        duration: 0.8, 
        ease: 'back.out(1.7)' 
    });
    
    // Skills animation
    if (gsap.ScrollTrigger) {
        gsap.from('#skills-container > div', {
            scrollTrigger: {
                trigger: '#skills-container',
                start: 'top 80%'
            },
            opacity: 0,
            x: -30,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out'
        });
        
        // Animate skill progress bars
        gsap.to('#skills-container .bg-blue-600', {
            scrollTrigger: {
                trigger: '#skills-container',
                start: 'top 80%'
            },
            width: 'var(--width)',
            duration: 1,
            stagger: 0.1,
            ease: 'power2.out',
            onStart: function() {
                // Set the width variable based on the data-level attribute
                document.querySelectorAll('#skills-container .bg-blue-600').forEach(bar => {
                    const parent = bar.closest('div');
                    const level = parent.querySelector('.text-sm').textContent.replace('%', '');
                    bar.style.setProperty('--width', level + '%');
                });
            }
        });
    }
}

/**
 * Initialize blog page specific animations
 */
function initBlogPageAnimations() {
    // Filter buttons animation
    gsap.from('.filter-btn', { 
        opacity: 0, 
        y: 20, 
        duration: 0.5, 
        stagger: 0.1, 
        ease: 'power2.out' 
    });
    
    // Blog cards animation
    if (gsap.ScrollTrigger) {
        gsap.from('#blog-container .blog-card', {
            scrollTrigger: {
                trigger: '#blog-container',
                start: 'top 80%'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        });
    } else {
        gsap.from('#blog-container .blog-card', { 
            opacity: 0, 
            y: 30, 
            duration: 0.6, 
            stagger: 0.1, 
            delay: 0.5, 
            ease: 'power2.out' 
        });
    }
}

/**
 * Initialize contact page specific animations
 */
function initContactPageAnimations() {
    // Contact form animation
    gsap.from('#contact-form', { 
        opacity: 0, 
        y: 30, 
        duration: 0.8, 
        ease: 'power2.out' 
    });
    
    gsap.from('#contact-form > div', { 
        opacity: 0, 
        y: 20, 
        duration: 0.5, 
        stagger: 0.1, 
        delay: 0.3, 
        ease: 'power2.out' 
    });
    
    // Contact info animation
    gsap.from('.contact-info .flex', { 
        opacity: 0, 
        x: 30, 
        duration: 0.5, 
        stagger: 0.1, 
        delay: 0.5, 
        ease: 'power2.out' 
    });
}

/**
 * Initialize scroll animations for elements
 */
function initScrollAnimations() {
    // Animate elements with .animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length === 0) return;
    
    // Use GSAP ScrollTrigger if available
    if (gsap.ScrollTrigger) {
        animatedElements.forEach(element => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleClass: {targets: element, className: 'is-visible'}
                },
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power2.out'
            });
        });
    } else {
        // Fallback to IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

/**
 * Fallback animations when GSAP is not available
 */
function fallbackAnimations() {
    // Add .fade-in class to elements that would be animated
    document.querySelectorAll('header, footer, #hero h1, #hero p, #hero a, .project-card, .blog-card, #contact-form, .filter-btn').forEach(element => {
        element.classList.add('fade-in');
    });
    
    // Use IntersectionObserver for scroll animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}
