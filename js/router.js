/**
 * Simple router for client-side page navigation
 * This is optional and can be used for single-page applications
 */

// Router class to handle client-side navigation
export class Router {
    constructor(routes) {
        this.routes = routes || {};
        this.defaultRoute = '/';
        this.currentRoute = null;
        this.contentContainer = null;
        this.initialized = false;
    }
    
    /**
     * Initialize the router
     * @param {string} contentContainerId - The ID of the container to render content in
     * @param {string} defaultRoute - The default route to use when no route is specified
     */
    init(contentContainerId, defaultRoute) {
        if (this.initialized) return;
        
        this.contentContainer = document.getElementById(contentContainerId);
        if (!this.contentContainer) {
            console.error(`Content container with ID "${contentContainerId}" not found.`);
            return;
        }
        
        if (defaultRoute) {
            this.defaultRoute = defaultRoute;
        }
        
        // Add event listeners for navigation
        this._addEventListeners();
        
        // Initial route navigation
        this._handleInitialRoute();
        
        this.initialized = true;
    }
    
    /**
     * Add a route to the router
     * @param {string} path - The route path
     * @param {Function} handler - The handler function for the route
     */
    addRoute(path, handler) {
        this.routes[path] = handler;
    }
    
    /**
     * Navigate to a specific route
     * @param {string} path - The route to navigate to
     * @param {Object} data - Optional data to pass to the route handler
     * @param {boolean} addToHistory - Whether to add the route to browser history
     */
    navigateTo(path, data = {}, addToHistory = true) {
        // Get the route handler
        const route = this.routes[path] || this.routes[this.defaultRoute];
        
        if (!route) {
            console.error(`No handler found for route "${path}"`);
            return;
        }
        
        // Update current route
        this.currentRoute = path;
        
        // Add to browser history if needed
        if (addToHistory) {
            window.history.pushState({ path, data }, '', path);
        }
        
        // Call the route handler
        route(data);
    }
    
    /**
     * Add event listeners for navigation
     * @private
     */
    _addEventListeners() {
        // Handle link clicks
        document.addEventListener('click', (e) => {
            // Find closest anchor tag
            const anchor = e.target.closest('a');
            
            if (anchor && anchor.hasAttribute('data-router-link')) {
                e.preventDefault();
                
                const path = anchor.getAttribute('href');
                this.navigateTo(path);
            }
        });
        
        // Handle browser history navigation
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.path) {
                this.navigateTo(e.state.path, e.state.data || {}, false);
            } else {
                this.navigateTo(this.defaultRoute, {}, false);
            }
        });
    }
    
    /**
     * Handle the initial route when the page loads
     * @private
     */
    _handleInitialRoute() {
        const path = window.location.pathname;
        
        if (this.routes[path]) {
            this.navigateTo(path, {}, false);
        } else {
            this.navigateTo(this.defaultRoute, {}, false);
        }
    }
}

// Export a default router instance
export const router = new Router();
