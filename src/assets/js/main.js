// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Theme toggling
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    
    // Check for saved theme preference or use system preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Apply initial theme
    // The inline script in index.html already handles initial theme setting.
    // This block ensures icons are correctly set based on the theme initially.
    if (document.documentElement.classList.contains('dark-theme')) {
        if (sunIcon && moonIcon) {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    } else {
        if (sunIcon && moonIcon) {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }
    
    // Theme toggle button
    themeToggle.addEventListener('click', function() {
        // Toggle dark-theme class on the html element
        const isDarkNow = document.documentElement.classList.toggle('dark-theme');
        
        // Update icons
        if (sunIcon && moonIcon) {
            if (isDarkNow) {
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            } else {
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            }
        }
        
        // Save preference to localStorage
        localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
        console.log('Theme toggled to:', isDarkNow ? 'dark' : 'light');
    });
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when a link is clicked
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                // First, remove any inline display styles to let the CSS class take full control
                item.style.display = ''; 

                if (filter === 'all') {
                    item.classList.remove('hidden-item');
                } else if (item.classList.contains(filter)) {
                    item.classList.remove('hidden-item');
                } else {
                    item.classList.add('hidden-item');
                }
            });
        });
    });
});