# Personal Portfolio Website

Single-page portfolio for Shubham Tomar: about, experience, stack, projects and writing.

Live: https://shubham-tomar.github.io/portfolio/

## Structure

- `index.html` – the whole site
- `css/site.css` – styles (dark terminal theme with a light option)
- `js/site.js` – theme toggle, menu, scroll effects, and rendering of projects and posts
- `data/projects.json`, `data/blogList.json` – edit these to change projects and blog posts
- `about.html`, `projects.html`, `blog.html`, `contact.html` – redirects to the matching section, kept so old links still work

## Run locally

No build step. Serve the folder with any static server:

```
npx serve
```
