import projectsJson from "@/data/projects.json";
import blogJson from "@/data/blogList.json";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a file in /public with the deploy base path; leave remote URLs alone. */
export function asset(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${basePath}/${path.replace(/^\//, "")}`;
}

export type CardLink = { label: string; href: string; tone: "accent" | "muted" };

export type CardData = {
  id: string;
  title: string;
  category: string;
  image: string;
  date?: string;
  body: string;
  tags?: string[];
  links: CardLink[];
};

type Project = {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
};

type BlogPost = {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  imageUrl: string;
  mediumUrl: string;
};

const projects = projectsJson as Project[];
const posts = blogJson as BlogPost[];

const isRealLink = (href?: string): href is string => !!href && href !== "#";

function projectCard(p: Project): CardData {
  const links: CardLink[] = [];
  if (isRealLink(p.demoUrl)) links.push({ label: "Live Demo", href: p.demoUrl, tone: "accent" });
  if (isRealLink(p.githubUrl)) links.push({ label: "GitHub", href: p.githubUrl, tone: "muted" });
  return {
    id: `project-${p.id}`,
    title: p.title,
    category: p.category,
    image: asset(p.imageUrl ?? "assets/images/project-placeholder.jpg"),
    body: p.description,
    tags: p.technologies,
    links,
  };
}

function postCard(p: BlogPost): CardData {
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    image: asset(p.imageUrl),
    date: p.date,
    body: p.summary,
    links: [{ label: "Read More →", href: p.mediumUrl, tone: "accent" }],
  };
}

export const allProjects = (): CardData[] => projects.map(projectCard);

export const featuredProjects = (limit = 3): CardData[] =>
  projects.filter((p) => p.featured).slice(0, limit).map(projectCard);

export const allPosts = (): CardData[] => posts.map(postCard);

export const recentPosts = (limit = 2): CardData[] =>
  [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map(postCard);
