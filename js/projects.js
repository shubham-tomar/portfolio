/**
 * Projects functionality for portfolio website
 * Handles loading and displaying projects
 */

// Store loaded project data
let projects = [];

/**
 * Initialize projects functionality
 */
export async function initProjects() {
    // Load project data
    await loadProjects();
    
    // Render projects
    renderProjects();
    
    // Initialize filter functionality
    initProjectFilters();
}

/**
 * Load projects data from JSON file
 */
async function loadProjects() {
    try {
        // Use a path that works both locally and on GitHub Pages
        const basePath = window.location.pathname.includes('/portfolio') ? '/portfolio' : '';
        const response = await fetch(`${basePath}/data/projects.json`);
        
        if (!response.ok) {
            throw new Error(`Failed to load project data: ${response.status} ${response.statusText}`);
        }
        
        projects = await response.json();
        return true;
    } catch (error) {
        console.error('Error loading projects:', error);
        
        // Fallback to sample data if JSON file couldn't be loaded
        projects = getSampleProjects();
        return false;
    }
}

/**
 * Render projects to the projects grid
 * @param {Array} projectsToRender - Optional array of projects to render (defaults to all projects)
 */
function renderProjects(projectsToRender = null) {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    // Clear container
    projectsGrid.innerHTML = '';
    
    // Use provided projects or all projects
    const displayProjects = projectsToRender || projects;
    
    if (displayProjects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-gray-600 dark:text-gray-400">No projects found.</p>
            </div>
        `;
        return;
    }
    
    // Render each project
    displayProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300';
        projectCard.dataset.category = project.category.toLowerCase();
        
        // Create HTML for project card
        projectCard.innerHTML = `
            <div class="relative">
                <img class="w-full h-48 object-cover" src="${project.imageUrl || 'assets/images/project-placeholder.jpg'}" alt="${project.title}">
                <div class="absolute top-0 right-0 bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded-bl-lg">
                    ${project.category}
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">${project.title}</h3>
                <p class="text-gray-700 dark:text-gray-300 mb-4">${project.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${project.technologies.map(tech => `
                        <span class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded">
                            ${tech}
                        </span>
                    `).join('')}
                </div>
                <div class="flex space-x-3">
                    ${project.demoUrl ? `
                        <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">
                            Live Demo
                        </a>
                    ` : ''}
                    ${project.githubUrl ? `
                        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-semibold">
                            GitHub
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Add to projects grid
        projectsGrid.appendChild(projectCard);
    });
}

/**
 * Initialize project filter functionality
 */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-white');
            });
            
            // Add active class to clicked button
            button.classList.add('active', 'bg-blue-600', 'text-white');
            button.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-white');
            
            // Get filter value
            const filter = button.dataset.filter;
            
            // Filter projects
            if (filter === 'all') {
                renderProjects();
            } else {
                const filteredProjects = projects.filter(project => {
                    return project.category.toLowerCase() === filter;
                });
                renderProjects(filteredProjects);
            }
        });
    });
}

/**
 * Load featured projects for the home page
 * @param {number} limit - Maximum number of projects to load
 */
export function loadFeaturedProjects(limit = 3) {
    // Check if projects container exists
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;
    
    // If projects aren't loaded yet, load them
    if (projects.length === 0) {
        loadProjects().then(() => {
            renderFeaturedProjects();
        });
    } else {
        renderFeaturedProjects();
    }
    
    // Render featured projects
    function renderFeaturedProjects() {
        // Filter featured projects and limit the number
        const featuredProjects = projects
            .filter(project => project.featured)
            .slice(0, limit);
        
        // Clear container
        projectsContainer.innerHTML = '';
        
        // Render each featured project
        featuredProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300';
            
            // Create HTML for project card
            projectCard.innerHTML = `
                <div class="relative">
                    <img class="w-full h-48 object-cover" src="${project.imageUrl || 'assets/images/project-placeholder.jpg'}" alt="${project.title}">
                    <div class="absolute top-0 right-0 bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded-bl-lg">
                        ${project.category}
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">${project.title}</h3>
                    <p class="text-gray-700 dark:text-gray-300 mb-4">${project.description}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${project.technologies.map(tech => `
                            <span class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded">
                                ${tech}
                            </span>
                        `).join('')}
                    </div>
                    <div class="flex space-x-3">
                        ${project.demoUrl ? `
                            <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">
                                Live Demo
                            </a>
                        ` : ''}
                        ${project.githubUrl ? `
                            <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-semibold">
                                GitHub
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
            
            // Add to projects container
            projectsContainer.appendChild(projectCard);
        });
        
        // Add fade-in class for animation
        const projectCards = projectsContainer.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.classList.add('fade-in');
        });
    }
}

/**
 * Get sample projects as fallback data
 * @returns {Array} - Array of sample project objects
 */
function getSampleProjects() {
    return [
        {
            id: 1,
            title: 'Personal Portfolio Website',
            description: 'A responsive portfolio website built with vanilla JavaScript and TailwindCSS.',
            category: 'Web',
            technologies: ['HTML', 'CSS', 'JavaScript', 'TailwindCSS'],
            imageUrl: 'assets/images/project-placeholder.jpg',
            demoUrl: '#',
            githubUrl: 'https://github.com/',
            featured: true
        },
        {
            id: 2,
            title: 'E-commerce Dashboard',
            description: 'A feature-rich admin dashboard for managing online store products and orders.',
            category: 'Web',
            technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
            imageUrl: 'assets/images/project-placeholder.jpg',
            demoUrl: '#',
            githubUrl: 'https://github.com/',
            featured: true
        },
        {
            id: 3,
            title: 'Weather App',
            description: 'A mobile app that provides real-time weather information and forecasts.',
            category: 'Mobile',
            technologies: ['React Native', 'JavaScript', 'Weather API'],
            imageUrl: 'assets/images/project-placeholder.jpg',
            demoUrl: '#',
            githubUrl: 'https://github.com/',
            featured: true
        },
        {
            id: 4,
            title: 'Task Management System',
            description: 'A task and project management application with team collaboration features.',
            category: 'Web',
            technologies: ['Angular', 'TypeScript', 'Firebase'],
            imageUrl: 'assets/images/project-placeholder.jpg',
            demoUrl: '#',
            githubUrl: 'https://github.com/',
            featured: false
        },
        {
            id: 5,
            title: 'Fitness Tracker',
            description: 'An application to track workouts, set fitness goals, and monitor progress.',
            category: 'Mobile',
            technologies: ['Flutter', 'Dart', 'Firebase'],
            imageUrl: 'assets/images/project-placeholder.jpg',
            demoUrl: '#',
            githubUrl: 'https://github.com/',
            featured: false
        },
        {
            id: 6,
            title: 'Data Visualization Dashboard',
            description: 'Interactive data visualizations and analytics dashboard for business insights.',
            category: 'Other',
            technologies: ['D3.js', 'Vue.js', 'Python', 'Pandas'],
            imageUrl: 'assets/images/project-placeholder.jpg',
            demoUrl: '#',
            githubUrl: 'https://github.com/',
            featured: false
        }
    ];
}
