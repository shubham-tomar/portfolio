# Personal Portfolio Website

Skills, experience, projects and blog posts. Built with Next.js (static export),
React, Tailwind CSS v4 and Motion.

## Develop

    npm install
    npm run dev      # http://localhost:3000

## Edit content

- Projects: `data/projects.json`
- Blog posts: `data/blogList.json`
- Everything else (bio links, timeline, skills, hero keywords): `lib/site.ts`

## Build and deploy

`npm run build` writes a fully static site to `out/`.

GitHub Pages: `.github/workflows/deploy.yml` builds and publishes on every push
to `main`. It needs the repo's Pages source set to "GitHub Actions"
(Settings → Pages), and it sets `NEXT_PUBLIC_BASE_PATH=/portfolio` so links and
assets resolve under `https://<user>.github.io/portfolio/`.

Vercel: import the repo; no configuration needed.
