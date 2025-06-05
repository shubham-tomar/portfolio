/**
 * Enhanced scroll animation system
 * Progressive enhancement approach - content is visible even without JS
 */

// Configuration for animations
const config = {
    // Default selectors to animate on all pages
    defaultSelectors: [
        'h1', 
        'h2',
        '.section-title',
        '.blog-card',
        '.project-card',
        '.profile-image-container',
        '#hero-container p',
        '#skills-container > div',
        '#experience-container > div',
        '#education-container > div',
        '.contact-form',
        '.social-links-container a'
    ],
    threshold: 0.1,  // Element visibility threshold for triggering animation
    rootMargin: '0px', // Margin around the root
    animationDelay: 300 // Delay before starting to observe elements
};

// Initialize scroll animations
export function initScrollAnimations() {
    console.log('Initializing scroll animations');
    
    // Wait a moment to ensure DOM is fully loaded and styled
    setTimeout(() => {
        // Apply default animations to common elements
        applyAnimationClassesToSelectors(config.defaultSelectors);
        
        // If IntersectionObserver is supported, set up animations
        if ('IntersectionObserver' in window) {
            // Mark the body as animation-ready
            document.body.classList.add('js-animation-ready');
            
            // Set up the intersection observer
            const observer = createAnimationObserver();
            
            // Start observing all elements with animation class
            const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
            console.log(`Found ${elementsToAnimate.length} elements to animate`);
            
            elementsToAnimate.forEach(element => {
                observer.observe(element);
            });
        } else {
            // For browsers without IntersectionObserver, just show everything
            console.log('Intersection Observer not supported, showing all elements');
            document.querySelectorAll('.animate-on-scroll').forEach(element => {
                element.classList.add('animated');
            });
        }
    }, config.animationDelay);
}

/**
 * Create an IntersectionObserver for handling animations
 */
function createAnimationObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the class that triggers the animation
                entry.target.classList.add('animated');
                // Stop observing once the element is animated
                observer.unobserve(entry.target); 
            }
        });
    }, {
        root: null,
        threshold: config.threshold,
        rootMargin: config.rootMargin
    });
    
    return observer;
}

/**
 * Apply animation classes to elements matching the given selectors
 * @param {Array} selectors - Array of CSS selectors
 */
function applyAnimationClassesToSelectors(selectors) {
    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            // Add the animation class if not already present
            if (!el.classList.contains('animate-on-scroll')) {
                el.classList.add('animate-on-scroll');
                
                // Add staggered delay for items in containers
                if (selector.includes('container') || 
                    selector.includes('card') ||
                    selector.includes('social-links')) {
                    const delay = Math.min(index, 4);
                    el.classList.add(`delay-${(delay + 1) * 100}`);
                }
            }
        });
    });
}

/**
 * Add staggered animation delays to children of a container
 * @param {string} containerId - ID of the container element
 */
/**
 * Add staggered animations to children of a container
 * @param {string} containerId - ID of the container element
 */
export function addStaggeredAnimations(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const children = container.children;
    Array.from(children).forEach((child, index) => {
        if (!child.classList.contains('animate-on-scroll')) {
            child.classList.add('animate-on-scroll');
        }
        
        // Add delay based on index (max 5 delays)
        const delay = Math.min(index, 4);
        child.classList.add(`delay-${(delay + 1) * 100}`);
    });
}