# Personal Portfolio Website

A modern, responsive portfolio website built with vanilla JavaScript and Tailwind CSS. This project features a clean separation of concerns, modular JavaScript architecture, and support for animations and 3D effects.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Dark/Light Mode**: Theme toggle with persistent user preference
- **Modular JavaScript**: Clean code organization with ES modules
- **Blog Support**: Display blog posts with Markdown rendering capability
- **Dynamic Projects**: Showcase your work with filterable project cards
- **Animations**: GSAP integration for smooth animations
- **3D Effects**: Optional Three.js integration for immersive backgrounds
- **Contact Form**: Ready-to-use contact form with validation

## Project Structure

```
portfolio/
├── index.html             # Home page
├── about.html             # About page
├── projects.html          # Projects showcase page
├── blog.html              # Blog listing page
├── contact.html           # Contact form page
│
├── assets/                # Static assets
│   ├── images/            # Image files
│   ├── fonts/             # Custom fonts
│   └── icons/             # Icon files
│
├── css/                   # Stylesheets
│   ├── main.css           # Main styles
│   └── themes.css         # Dark/light mode themes
│
├── js/                    # JavaScript modules
│   ├── main.js            # Entry script
│   ├── router.js          # Page navigation (optional)
│   ├── nav.js             # Navigation behavior
│   ├── animation.js       # GSAP animations
│   ├── three-init.js      # Three.js setup
│   ├── markdown-renderer.js # Render blog posts
│   ├── blogList.js        # Blog functionality
│   └── projects.js        # Projects functionality
│
├── blogs/                 # Blog content
│   ├── blog1.md           # Sample blog post
│   └── blog2.md           # Sample blog post
│
├── components/            # HTML components
│   ├── header.html        # Header component
│   ├── footer.html        # Footer component
│   └── blogCard.html      # Blog card template
│
├── data/                  # JSON data files
│   ├── projects.json      # Projects data
│   └── blogList.json      # Blog metadata
│
└── libs/                  # Third-party libraries
    ├── gsap.min.js        # Animation library
    ├── three.min.js       # 3D library
    └── showdown.min.js    # Markdown converter
```

## Getting Started

1. Clone this repository
2. Customize the content in HTML files and data JSON files
3. Replace placeholder images in the assets directory
4. Update your personal information in about.html and contact.html
5. Modify projects.json and blogList.json with your own content
6. Serve the files using a local development server

## Development

For local development, you can use any simple HTTP server. For example:

```bash
# Using Python
python -m http.server

# Using Node.js and npx
npx serve
```

## Customization

- **Themes**: Edit themes.css to customize colors for light and dark modes
- **Content**: Update HTML files and JSON data files with your information
- **Styling**: Tailwind CSS is included via CDN, customize as needed
- **Animations**: Modify animation.js to change page animations
- **3D Effects**: Customize three-init.js for different 3D backgrounds

## Technologies

- HTML5 & CSS3
- JavaScript (ES6+)
- Tailwind CSS
- GSAP (GreenSock Animation Platform)
- Three.js (optional)
- Showdown.js (for Markdown rendering)

## Browser Support

This portfolio website supports all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge
