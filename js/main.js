// Main JavaScript file for the portfolio website
import { initNavigation } from './nav.js';
import { initializeAnimations } from './animation.js';

// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', async () => {
    // Load header and footer components
    await loadComponent('header-container', 'components/header.html');
    await loadComponent('footer-container', 'components/footer.html');
    
    // Initialize navigation
    initNavigation();
    
    // Initialize theme
    initTheme();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize animations
    initializeAnimations();
    
    // Page-specific initializations
    initCurrentPage();
});

/**
 * Load a component into a container
 * @param {string} containerId - The ID of the container element
 * @param {string} componentPath - The path to the component HTML file
 * @returns {Promise} - A promise that resolves when the component is loaded
 */
async function loadComponent(containerId, componentPath) {
    try {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
        
        const html = await response.text();
        container.innerHTML = html;
        
        return true;
    } catch (error) {
        console.error('Error loading component:', error);
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
    
    // Check for saved theme preference or use prefer-color-scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
        darkIcon.classList.add('hidden');
        lightIcon.classList.remove('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
    }
    
    // Theme toggle button click handler
    themeToggleBtn.addEventListener('click', toggleTheme);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    
    // Toggle theme class
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        darkIcon.classList.add('hidden');
        lightIcon.classList.remove('hidden');
    }
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
        { name: 'JavaScript', level: 90 },
        { name: 'HTML/CSS', level: 85 },
        { name: 'React', level: 80 },
        { name: 'Node.js', level: 75 },
        { name: 'Python', level: 70 },
        { name: 'Go', level: 65 },
        { name: 'SQL', level: 80 },
        { name: 'GraphQL', level: 70 }
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
            title: 'Senior Software Engineer',
            company: 'Example Tech',
            period: '2022 - Present',
            description: 'Leading development of web applications using modern JavaScript frameworks.'
        },
        {
            title: 'Software Engineer',
            company: 'Tech Solutions',
            period: '2020 - 2022',
            description: 'Developed and maintained full-stack web applications.'
        },
        {
            title: 'Junior Developer',
            company: 'StartUp Inc',
            period: '2018 - 2020',
            description: 'Contributed to frontend development using React and responsive design.'
        }
    ];
    
    const experienceContainer = document.getElementById('experience-container');
    if (experienceContainer) {
        experiences.forEach(exp => {
            const expElement = document.createElement('div');
            expElement.className = 'border-l-4 border-blue-600 pl-4';
            expElement.innerHTML = `
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">${exp.title}</h3>
                <p class="text-gray-600 dark:text-gray-400">${exp.company} | ${exp.period}</p>
                <p class="text-gray-700 dark:text-gray-300 mt-2">${exp.description}</p>
            `;
            experienceContainer.appendChild(expElement);
        });
    }
    
    // Load education
    const education = [
        {
            degree: 'Master of Computer Science',
            school: 'Example University',
            period: '2016 - 2018',
            description: 'Specialized in Software Engineering and Distributed Systems.'
        },
        {
            degree: 'Bachelor of Engineering',
            school: 'Technical University',
            period: '2012 - 2016',
            description: 'Major in Computer Science with focus on software development.'
        }
    ];
    
    const educationContainer = document.getElementById('education-container');
    if (educationContainer) {
        education.forEach(edu => {
            const eduElement = document.createElement('div');
            eduElement.className = 'border-l-4 border-blue-600 pl-4';
            eduElement.innerHTML = `
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">${edu.degree}</h3>
                <p class="text-gray-600 dark:text-gray-400">${edu.school} | ${edu.period}</p>
                <p class="text-gray-700 dark:text-gray-300 mt-2">${edu.description}</p>
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
