// Main JavaScript file for the portfolio website
import { initNavigation } from './nav.js';
import { initializeAnimations } from './animation.js';

// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', initApp);

// Handle page visibility changes (tab switching)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Page is visible again, check if components are loaded
        const header = document.getElementById('header-container');
        const footer = document.getElementById('footer-container');
        
        if (header && !header.children.length) {
            console.log('Header component missing after tab switch, reloading components');
            initApp();
        }
    }
});

// Initialize the application
async function initApp() {
    try {
        console.log('Initializing application...');
        
        // Load header component first
        const headerLoaded = await loadComponent('header-container', 'components/header.html');
        
        // Initialize theme AFTER header is loaded
        if (headerLoaded) {
            initTheme();
        }
        
        // Load footer component
        const footerLoaded = await loadComponent('footer-container', 'components/footer.html');
        
        // Initialize navigation
        initNavigation();
        
        // Set current year in footer
        if (footerLoaded) {
            const yearElement = document.getElementById('current-year');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
        }
        
        // Check if GSAP is available before initializing animations
        if (typeof gsap !== 'undefined') {
            // Initialize animations
            initializeAnimations();
        } else {
            console.warn('GSAP library not loaded. Animations will not work.');
        }
        
        // Page-specific initializations
        initCurrentPage();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

/**
 * Load a component into a container
 * @param {string} containerId - The ID of the container element
 * @param {string} componentPath - The path to the component HTML file
 * @returns {Promise<boolean>} - A promise that resolves when the component is loaded
 */
async function loadComponent(containerId, componentPath) {
    try {
        // Find container element
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID '${containerId}' not found`);
            return false;
        }
        
        // Check if container already has content
        // if (container.children.length > 0) {
        //     console.log(`Container '${containerId}' already has content, skipping load`);
        //     return true;
        // }
        
        // Clear any existing content in the container
        console.log(`Clearing content of container '${containerId}'`);
        container.innerHTML = '';
        
        // Fetch component HTML with cache busting to prevent stale content
        const cacheBuster = `?_=${Date.now()}`;
        // Detect if we're on GitHub Pages and adjust path accordingly
        const basePath = window.location.pathname.includes('/portfolio') ? '/portfolio/' : '/';
        // Ensure we don't duplicate slashes in the path
        const adjustedPath = componentPath.startsWith('/') ? componentPath.slice(1) : componentPath;
        const response = await fetch(`${basePath}${adjustedPath}${cacheBuster}`);
        
        if (!response.ok) {
            throw new Error(`Failed to load ${componentPath}: ${response.status} ${response.statusText}`);
        }
        
        const html = await response.text();
        if (!html.trim()) {
            throw new Error(`Empty content loaded from ${componentPath}`);
        }
        
        // Insert component HTML
        container.innerHTML = html;
        console.log(`Successfully loaded component into '${containerId}', after clearing existing content`);
        
        return true;
    } catch (error) {
        console.error(`Error loading component '${componentPath}' into '${containerId}':`, error);
        return false;
    }
}

/**
 * Initialize theme based on user preference
 */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    
    // Check if elements exist
    if (!themeToggleBtn || !darkIcon || !lightIcon) {
        console.error('Theme toggle elements not found');
        return;
    }
    
    // Check for saved theme preference or use prefer-color-scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
        darkIcon.classList.add('hidden');
        lightIcon.classList.remove('hidden');
        console.log('Dark mode applied');
    } else {
        document.documentElement.classList.remove('dark');
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
        console.log('Light mode applied');
    }
    
    // Theme toggle button click handler
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Log the current state for debugging
    console.log('Theme initialized, current class list:', document.documentElement.classList);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    
    // Check if elements exist
    if (!darkIcon || !lightIcon) {
        console.error('Theme toggle icons not found');
        return;
    }
    
    console.log('Toggle theme clicked. Current state:', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    
    // Get the current theme from localStorage or default to system preference
    const currentTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = currentTheme === 'dark' || (!currentTheme && prefersDark);
    
    if (isDarkMode) {
        // Switch to light theme
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        
        // Show dark icon (indicating ability to switch to dark)
        darkIcon.classList.remove('hidden');
        lightIcon.classList.add('hidden');
        console.log('Switched to light theme');
    } else {
        // Switch to dark theme
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        
        // Show light icon (indicating ability to switch to light)
        lightIcon.classList.remove('hidden');
        darkIcon.classList.add('hidden');
        console.log('Switched to dark theme');
    }
    
    // Force a CSS variable update by adding and removing a class
    document.body.classList.add('theme-toggled');
    setTimeout(() => {
        document.body.classList.remove('theme-toggled');
    }, 10);
}

/**
 * Initialize current page specific functionality
 */
function initCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Set active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Page-specific initializations
    switch (currentPage) {
        case 'index.html':
            initHomePage();
            break;
        case 'projects.html':
            import('./projects.js').then(module => module.initProjects());
            break;
        case 'blog.html':
            import('./blogList.js').then(module => module.initBlogList());
            break;
        case 'contact.html':
            initContactForm();
            break;
        case 'about.html':
            initAboutPage();
            break;
    }
}

/**
 * Initialize home page specific elements
 */
function initHomePage() {
    // Load featured projects
    import('./projects.js').then(module => {
        module.loadFeaturedProjects();
    });
    
    // Load recent blog posts
    import('./blogList.js').then(module => {
        module.loadRecentBlogPosts();
    });
}

/**
 * Initialize about page specific elements
 */
function initAboutPage() {
    // Load skills
    const skills = [
        { name: 'Backend', level: 95 },
        { name: 'Data Engineering', level: 90 },
        { name: 'Databases Internals', level: 90 },
        { name: 'ETL', level: 85 },
        { name: 'Systems', level: 85 },
        { name: 'Real-time Data Processing', level: 80 },
        { name: 'Building Microservices', level: 85 },
        { name: 'Data LakeHouse', level: 80 }
    ];
    
    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer) {
        skills.forEach(skill => {
            const skillElement = document.createElement('div');
            skillElement.className = 'bg-gray-100 dark:bg-gray-700 rounded-lg p-3';
            skillElement.innerHTML = `
                <div class="flex justify-between mb-1">
                    <span class="font-medium text-gray-700 dark:text-gray-300">${skill.name}</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">${skill.level}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" style="width: ${skill.level}%"></div>
                </div>
            `;
            skillsContainer.appendChild(skillElement);
        });
    }
    
    // Load experience
    const experiences = [
        {
            title: 'Senior Data Engineer',
            company: 'Pixis.ai',
            period: 'Jan 2025 - Present',
            description: `Leading development of lakehouse architecture using Iceberg, nessie, warpstream(Kafka alternative), Doris DB, and other modern data engineering tools and frameworks.
            <ul class="list-disc pl-5 mt-3 space-y-1">
                <li>Helped Pixis build <a href="https://interact.pixis.ai/interact" class="text-accent hover:text-accent-hover font-semibold" target="_blank">Interact</a>, an AI powered conversational analytics interface for marketing teams to query ad performance and receive actionable insights. Leveraged MongoDB to store dynamic queries, responses, and campaign metadata for personalized recommendations and traceability.</li>
                <li>Developed Nessie go-client library for seamless interaction with Nessie catalog.</li>
                <li>Developed icebridge microservice which acts as a bridge between Nessie catalog and other applications with Iceberg.</li>
                <li>Contributed to open source <a href="https://github.com/apache/iceberg-go" class="text-accent hover:text-accent-hover font-semibold" target="_blank">apache/iceberg-go</a> library by adding <a href="https://github.com/apache/iceberg-go/pull/308" class="text-accent hover:text-accent-hover font-semibold" target="_blank">fix for createTable API</a>.</li>
                <li>Migrated 4TB of Postgres data from non-partitioned to partitioned schema using custom built pgx-copy pipeline for faster data transfer. Improved query performance by 4x.</li>
            </ul>`
        },
        {
            title: 'Product Engineer - Data',
            company: 'Juspay Technologies',
            period: 'Dec 2020 - Dec 2024',
            description: `Developed in house data platform to handle batch as well as real-time data processing using Kafka, cassandra, Clickhouse, and other modern data engineering tools and frameworks.
                <ul class="list-disc pl-5 mt-3 space-y-1">
                    <li>Spearheaded the development of a robust ETL Data Framework for handling over 20 million transactions daily across diverse data sources (MySQL, Postgres, Kafka, Clickhouse, BigQuery), ensuring optimal monitoring, alerting, and data availability.</li>
                    <li>Engineered a high-throughput Real-Time Streaming pipeline, achieving ~150k logs/sec, integrating technologies such as Redis Streams, Cassandra, Kafka, and Clickhouse.</li>
                    <li>Achieved a significant reduction in data pipeline costs by approximately 80% and enhanced analytical query performance by 10x, leveraging Clickhouse optimizations.</li>
                    <li>Pioneered the Autopilot platform for seamless cloud deployments (GCP/AWS), incorporating features like config control, staggered release, and autoscaling, enhancing deployment efficiency and cloud resource management.</li>
                </ul>`
        },
        {
            title: 'Software Engineer',
            company: 'BTM Financial',
            period: 'Sep 2019 - Dec 2020',
            description: `Worked with various international clients to build and maintain their applications using modern tools and frameworks.
            <ul class="list-disc pl-5 mt-3 space-y-1">
                <li>Helped BTM setup RDBMS data source, design schema and data flow for a edTech website.</li>
                <li>Created a pipeline to fetch tweets related to crypto currency and performed sentiment analysis using LSTM.</li>
                <li>Migrate and automate quantitative regression tests from excel sheets to a python framework.</li>
            </ul>`
        }
    ];
    
    const experienceContainer = document.getElementById('experience-container');
    if (experienceContainer) {
        experiences.forEach(exp => {
            const expElement = document.createElement('div');
            expElement.className = 'border-l-4 border-blue-600 pl-4';
            expElement.innerHTML = `
                <h3 class="text-xl font-bold text-custom-primary">${exp.title}</h3>
                <p class="text-custom-accent">${exp.company} | ${exp.period}</p>
                <p class="text-custom-secondary mt-2">${exp.description}</p>
            `;
            experienceContainer.appendChild(expElement);
        });
    }
    
    // Load education
    const education = [
        {
            degree: 'Bachelor of Computer Science (Specialization in Data Engineering)',
            school: 'GLA University, Mathura',
            period: '2016 - 2020',
            description: 'Specialized in Data Engineering and Data Warehousing.'
        }
    ];
    
    const educationContainer = document.getElementById('education-container');
    if (educationContainer) {
        education.forEach(edu => {
            const eduElement = document.createElement('div');
            eduElement.className = 'border-l-4 border-blue-600 pl-4';
            eduElement.innerHTML = `
                <h3 class="text-xl font-bold text-custom-primary">${edu.degree}</h3>
                <p class="text-custom-accent">${edu.school} | ${edu.period}</p>
                <p class="text-custom-secondary mt-2">${edu.description}</p>
            `;
            educationContainer.appendChild(eduElement);
        });
    }
}

/**
 * Initialize contact form
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const formProps = Object.fromEntries(formData);
        
        // Here you would typically send the form data to a backend server
        // For demonstration, we'll just log it and show a success message
        console.log('Form submitted:', formProps);
        
        // Show success message
        form.innerHTML = `
            <div class="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 p-4 rounded-lg">
                <h3 class="font-bold text-lg">Message Sent!</h3>
                <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
            </div>
        `;
    });
}
