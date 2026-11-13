/**
 * Blog post management functionality
 * Handles loading and displaying blog posts
 */

import { fetchAndRenderMarkdown } from './markdown-renderer.js';

// Store loaded blog data
let blogPosts = [];

/**
 * Initialize blog list functionality
 */
export async function initBlogList() {
    console.log('Initializing blog list...');
    // Load blog posts data
    await loadBlogPosts();
    
    // Render blog posts
    renderBlogPosts();
    
    // Initialize filter functionality
    initBlogFilters();
}

/**
 * Load blog posts data from JSON file
 */
async function loadBlogPosts() {
    try {
        console.log('Fetching blog posts data...');
        // Use a path that works both locally and on GitHub Pages
        const basePath = window.location.pathname.includes('/portfolio') ? '/portfolio' : '';
        const response = await fetch(`${basePath}/data/blogList.json`);
        
        if (!response.ok) {
            throw new Error(`Failed to load blog data: ${response.status} ${response.statusText}`);
        }
        
        blogPosts = await response.json();
        console.log('Successfully loaded blog posts:', blogPosts);
        return true;
    } catch (error) {
        console.error('Error loading blog posts:', error);
        
        // Fallback to sample data if JSON file couldn't be loaded
        console.log('Using fallback sample blog posts');
        blogPosts = getSampleBlogPosts();
        return false;
    }
}

/**
 * Render blog posts to the blog container
 * @param {Array} posts - Optional array of posts to render (defaults to all posts)
 */
function renderBlogPosts(posts = null) {
    const blogContainer = document.getElementById('blog-container');
    if (!blogContainer) {
        console.error('Blog container not found');
        return;
    }
    
    console.log('Rendering blog posts...');
    
    // Clear container
    blogContainer.innerHTML = '';
    
    // Use provided posts or all posts
    const postsToRender = posts || blogPosts;
    
    console.log('Posts to render:', postsToRender);
    
    if (!postsToRender || postsToRender.length === 0) {
        blogContainer.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-gray-600 dark:text-gray-400">No blog posts found.</p>
            </div>
        `;
        return;
    }
    
    // Directly render blog posts without template
    postsToRender.forEach(post => {
        const blogCard = document.createElement('div');
        blogCard.className = 'blog-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300';
        
        blogCard.innerHTML = `
            <div class="relative">
                <img class="blog-image w-full h-48 object-cover" src="${post.imageUrl}" alt="${post.title}">
                <div class="absolute top-0 right-0 bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded-bl-lg">
                    ${post.category}
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">${post.title}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">${post.date}</p>
                <p class="text-gray-700 dark:text-gray-300 mb-4">${post.summary}</p>
                <a href="${post.mediumUrl}" target="_blank" rel="noopener noreferrer" class="inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">Read More →</a>
            </div>
        `;
        
        blogContainer.appendChild(blogCard);
    });
}

/**
 * Initialize blog filter functionality
 */
function initBlogFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!filterButtons.length) return;
    
    console.log('Initializing blog filters with', filterButtons.length, 'buttons');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-accent', 'text-white');
                btn.classList.add('bg-custom-secondary', 'text-custom-primary', 'border', 'border-custom');
            });
            
            // Add active class to clicked button
            button.classList.add('active', 'bg-accent', 'text-white');
            button.classList.remove('bg-custom-secondary', 'text-custom-primary', 'border', 'border-custom');
            
            const filter = button.getAttribute('data-filter');
            console.log('Filtering blogs by:', filter);
            
            if (filter === 'all') {
                renderBlogPosts();
            } else {
                const filteredPosts = blogPosts.filter(post => {
                    return post.category.toLowerCase() === filter.toLowerCase();
                });
                
                renderBlogPosts(filteredPosts);
            }
        });
    });
}

/**
 * Load and display a single blog post
 * @param {string} blogId - The ID of the blog post to display
 * @param {string} containerId - The ID of the container to render the blog post in
 */
export async function loadBlogPost(blogId, containerId = 'blog-content') {
    try {
        // First ensure blog data is loaded
        if (blogPosts.length === 0) {
            await loadBlogPosts();
        }
        
        // Find the blog post by ID
        const post = blogPosts.find(post => post.id === blogId);
        
        if (!post) {
            throw new Error(`Blog post with ID "${blogId}" not found.`);
        }
        
        // If the post has a local markdown file, render it
        if (post.markdownFile) {
            await fetchAndRenderMarkdown(`blogs/${post.markdownFile}`, containerId);
            
            // Set page title and metadata
            document.title = `${post.title} | Blog | Shubham Tomar`;
            
            // Set blog post metadata
            const metadataElement = document.getElementById('blog-metadata');
            if (metadataElement) {
                metadataElement.innerHTML = `
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">${post.title}</h1>
                    <div class="flex items-center text-gray-600 dark:text-gray-400 mb-6">
                        <span class="mr-4">${post.date}</span>
                        <span class="bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded-lg">${post.category}</span>
                    </div>
                `;
            }
            
            return true;
        } else {
            // If it's an external post (like Medium), redirect
            window.location.href = post.mediumUrl;
            return false;
        }
    } catch (error) {
        console.error('Error loading blog post:', error);
        
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded-lg">
                    <h3 class="font-bold">Error Loading Blog Post</h3>
                    <p>${error.message}</p>
                    <a href="blog.html" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-4 inline-block">← Back to Blog List</a>
                </div>
            `;
        }
        
        return false;
    }
}

/**
 * Load recent blog posts for the home page
 * @param {number} limit - Maximum number of posts to load
 */
export function loadRecentBlogPosts(limit = 2) {
    // Check if blog container exists
    const blogsContainer = document.getElementById('blogs-container');
    if (!blogsContainer) return;
    
    // If blog posts aren't loaded yet, load them
    if (blogPosts.length === 0) {
        loadBlogPosts().then(() => {
            renderRecentPosts();
        });
    } else {
        renderRecentPosts();
    }
    
    // Render recent posts
    function renderRecentPosts() {
        // Sort by date (newest first) and take the specified limit
        const recentPosts = [...blogPosts]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
        
        // Load blog card template
        fetch('components/blogCard.html')
            .then(response => response.text())
            .then(template => {
                // Clear container
                blogsContainer.innerHTML = '';
                
                // Render each recent post
                recentPosts.forEach(post => {
                    const blogCardHtml = template
                        .replace(/{{imageUrl}}/g, post.imageUrl || 'assets/images/blog-placeholder.jpg')
                        .replace(/{{title}}/g, post.title)
                        .replace(/{{date}}/g, post.date)
                        .replace(/{{category}}/g, post.category)
                        .replace(/{{summary}}/g, post.summary)
                        .replace(/{{mediumUrl}}/g, post.mediumUrl);
                    
                    // Add to container
                    blogsContainer.innerHTML += blogCardHtml;
                });
                
                // Add fade-in class for animation
                const blogCards = blogsContainer.querySelectorAll('.blog-card');
                blogCards.forEach(card => {
                    card.classList.add('fade-in');
                });
            })
            .catch(error => {
                console.error('Error loading blog card template:', error);
                
                // Fallback rendering
                blogsContainer.innerHTML = '';
                
                recentPosts.forEach(post => {
                    const blogCard = document.createElement('div');
                    blogCard.className = 'blog-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg fade-in';
                    
                    blogCard.innerHTML = `
                        <div class="relative">
                            <img class="w-full h-48 object-cover" src="${post.imageUrl || 'assets/images/blog-placeholder.jpg'}" alt="${post.title}">
                            <div class="absolute top-0 right-0 bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded-bl-lg">
                                ${post.category}
                            </div>
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">${post.title}</h3>
                            <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">${post.date}</p>
                            <p class="text-gray-700 dark:text-gray-300 mb-4">${post.summary}</p>
                            <a href="${post.mediumUrl}" target="_blank" rel="noopener noreferrer" class="inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">Read More →</a>
                        </div>
                    `;
                    
                    blogsContainer.appendChild(blogCard);
                });
            });
    }
}

/**
 * Get sample blog posts as fallback data
 * @returns {Array} - Array of sample blog post objects
 */
function getSampleBlogPosts() {
    return [
        {
            id: 'blog1',
            title: 'Getting Started with Modern JavaScript',
            date: 'May 20, 2025',
            category: 'Tech',
            summary: 'Learn the fundamentals of modern JavaScript and how to use the latest features to build better web applications.',
            imageUrl: 'assets/images/blog-placeholder.jpg',
            mediumUrl: 'https://medium.com/',
            markdownFile: 'blog1.md'
        },
        {
            id: 'blog2',
            title: 'Building Responsive Websites with Tailwind CSS',
            date: 'May 10, 2025',
            category: 'Tutorials',
            summary: 'A step-by-step guide to creating beautiful, responsive websites using Tailwind CSS framework.',
            imageUrl: 'assets/images/blog-placeholder.jpg',
            mediumUrl: 'https://medium.com/',
            markdownFile: 'blog2.md'
        },
        {
            id: 'blog3',
            title: 'The Future of Web Development in 2025',
            date: 'April 28, 2025',
            category: 'Insights',
            summary: 'Exploring the emerging trends and technologies that will shape the future of web development.',
            imageUrl: 'assets/images/blog-placeholder.jpg',
            mediumUrl: 'https://medium.com/',
            markdownFile: null
        },
        {
            id: 'blog4',
            title: 'Creating 3D Animations with Three.js',
            date: 'April 15, 2025',
            category: 'Tutorials',
            summary: 'A comprehensive tutorial on how to create impressive 3D animations for your web projects using Three.js.',
            imageUrl: 'assets/images/blog-placeholder.jpg',
            mediumUrl: 'https://medium.com/',
            markdownFile: null
        }
    ];
}
