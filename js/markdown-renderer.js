/**
 * Markdown renderer for blog posts
 * Uses showdown.js to convert markdown to HTML
 */

// Configuration options for the markdown converter
const MARKDOWN_OPTIONS = {
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
    openLinksInNewWindow: true,
    emoji: true,
    underline: true,
    ghCodeBlocks: true,
    encodeEmails: true
};

/**
 * Convert markdown to HTML
 * @param {string} markdown - The markdown content to convert
 * @returns {string} - The converted HTML
 */
export function markdownToHtml(markdown) {
    // Check if showdown is loaded
    if (typeof showdown === 'undefined') {
        console.error('Showdown library not loaded. Markdown rendering will not work.');
        return `<div class="error-message">Error: Markdown library not loaded.</div>`;
    }
    
    try {
        // Create converter with options
        const converter = new showdown.Converter(MARKDOWN_OPTIONS);
        
        // Convert markdown to HTML
        return converter.makeHtml(markdown);
    } catch (error) {
        console.error('Error converting markdown to HTML:', error);
        return `<div class="error-message">Error converting markdown: ${error.message}</div>`;
    }
}

/**
 * Fetch and render markdown content from a file
 * @param {string} url - The URL of the markdown file
 * @param {string} targetElementId - The ID of the element to render the content in
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export async function fetchAndRenderMarkdown(url, targetElementId) {
    const targetElement = document.getElementById(targetElementId);
    
    if (!targetElement) {
        console.error(`Target element with ID "${targetElementId}" not found.`);
        return false;
    }
    
    try {
        // Show loading indicator
        targetElement.innerHTML = '<div class="loading">Loading content...</div>';
        
        // Fetch markdown content
        // Use a path that works both locally and on GitHub Pages
        const basePath = window.location.pathname.includes('/portfolio') ? '/portfolio' : '';
        // Check if the URL is already absolute or includes the base path
        const fullUrl = url.startsWith('http') || url.startsWith(basePath) ? url : `${basePath}/${url}`;
        const response = await fetch(fullUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch markdown from ${url}: ${response.status} ${response.statusText}`);
        }
        
        const markdown = await response.text();
        
        // Convert and render HTML
        targetElement.innerHTML = markdownToHtml(markdown);
        
        // Highlight code blocks if Prism.js is available
        if (typeof Prism !== 'undefined') {
            Prism.highlightAllUnder(targetElement);
        }
        
        return true;
    } catch (error) {
        console.error('Error fetching and rendering markdown:', error);
        targetElement.innerHTML = `
            <div class="error-message bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded-lg">
                <h3 class="font-bold">Error Loading Content</h3>
                <p>${error.message}</p>
            </div>
        `;
        return false;
    }
}

/**
 * Parse front matter from markdown content
 * Expects YAML-style front matter between --- delimiters
 * @param {string} markdown - The markdown content with front matter
 * @returns {Object} - An object with content and metadata properties
 */
export function parseMarkdownWithFrontMatter(markdown) {
    // Default return object
    const result = {
        content: markdown,
        metadata: {}
    };
    
    // Check for front matter delimiter
    if (!markdown.startsWith('---')) {
        return result;
    }
    
    try {
        // Find the closing delimiter
        const endOfFrontMatter = markdown.indexOf('---', 3);
        
        if (endOfFrontMatter === -1) {
            return result;
        }
        
        // Extract front matter and content
        const frontMatter = markdown.substring(3, endOfFrontMatter).trim();
        const content = markdown.substring(endOfFrontMatter + 3).trim();
        
        // Parse front matter
        const metadata = {};
        frontMatter.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex !== -1) {
                const key = line.substring(0, colonIndex).trim();
                const value = line.substring(colonIndex + 1).trim();
                metadata[key] = value;
            }
        });
        
        return {
            content,
            metadata
        };
    } catch (error) {
        console.error('Error parsing markdown front matter:', error);
        return result;
    }
}
