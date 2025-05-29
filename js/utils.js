/**
 * Utility functions for the portfolio website
 */

/**
 * Reloads stylesheets by adding a cache-busting query parameter
 * Ensures CSS changes are immediately reflected without hard refresh
 */
export function reloadStylesheets() {
    const links = document.getElementsByTagName('link');
    for (let i = 0; i < links.length; i++) {
        if (links[i].rel === 'stylesheet') {
            const href = links[i].href.replace(/\?.*|$/, '?v=' + new Date().getTime());
            links[i].href = href;
        }
    }
    console.log('Stylesheets reloaded with cache busting');
}

/**
 * Initializes Tailwind CSS dark mode configuration
 * Sets up custom colors and other theme extensions
 */
export function initTailwindConfig() {
    if (typeof tailwind !== 'undefined') {
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        // Custom dark mode colors
                        darkbg: '#0c0c0c',
                        darksecondary: '#8880e8',
                        darktext: '#f9fafb',
                        darktextsecondary: '#d1d5db',
                        darkaccent: '#3b82f6',
                        darkborder: '#374151'
                    }
                }
            }
        };
        console.log('Tailwind configuration initialized');
    } else {
        console.warn('Tailwind not loaded, skipping configuration');
    }
}

/**
 * Loads a JavaScript library dynamically
 * @param {string} path - Path to the library
 * @returns {Promise<boolean>} - Promise resolving to true if loaded successfully
 */
export function loadLibrary(path) {
    return fetch(path)
        .then(response => {
            if (!response.ok) {
                console.warn(`Library ${path} not found.`);
                return false;
            } else {
                // Create and load script dynamically if it exists
                const script = document.createElement('script');
                script.src = path;
                document.body.appendChild(script);
                return true;
            }
        })
        .catch(error => {
            console.warn(`Error checking for library ${path}:`, error);
            return false;
        });
}

/**
 * Loads required libraries for the website
 * Handles both GSAP and Showdown libraries
 */
export function loadRequiredLibraries() {
    // Load GSAP for animations
    loadLibrary('libs/gsap.min.js')
        .then(loaded => {
            if (loaded) {
                console.log('GSAP library loaded successfully');
            } else {
                console.warn('GSAP library not found. Animations will be disabled.');
            }
        });
    
    // Load Showdown for markdown rendering (if on blog page)
    if (window.location.pathname.includes('blog.html')) {
        loadLibrary('libs/showdown.min.js')
            .then(loaded => {
                if (!loaded) {
                    console.warn('Markdown rendering will not work without Showdown library');
                } else {
                    console.log('Showdown library loaded successfully');
                }
            });
    }
}

/**
 * Initialize all utility functions on page load
 */
export function initUtils() {
    // Initialize Tailwind config
    initTailwindConfig();
    
    // Load required libraries
    loadRequiredLibraries();
    
    // Reload stylesheets to apply any changes
    window.addEventListener('load', reloadStylesheets);
    
    console.log('Utilities initialized');
}

// Auto-initialize utilities when script is loaded
document.addEventListener('DOMContentLoaded', initUtils);
