import type { IconName } from "./icon-paths";

export const site = {
  name: "Shubham Tomar",
  role: "Software Engineer & Developer",
  tagline:
    "Software Engineer & Developer specializing in building scalable and efficient applications.",
  description:
    "Portfolio website of Shubham Tomar - Software Engineer and Developer",
  email: "shubhamtomar1498@gmail.com",
  location: "Bengaluru, India",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export const socials: { name: string; icon: IconName; href: string }[] = [
  { name: "GitHub", icon: "github", href: "https://github.com/shubham-tomar" },
  { name: "Medium", icon: "medium", href: "https://medium.com/@shubham-tomar/" },
  {
    name: "LinkedIn",
    icon: "linkedin",
    href: "https://linkedin.com/in/shubham-tomar-cs",
  },
  {
    name: "Instagram",
    icon: "instagram",
    href: "https://www.instagram.com/shubham._tomar/",
  },
];

/** Words that drift behind the hero and are revealed under the cursor. */
export const keywords = [
  "GCP", "Kafka", "Football", "AWS", "Linux", "Redis", "Warpstream",
  "Databases Internals", "Python", "Content Writing", "Rust", "Redshift",
  "MySQL", "K8s", "Postgres", "Doris", "Bash", "GoLang", "GraphQl", "Haskell",
  "Nix", "Cricket", "BigQuery", "Iceberg", "Nessie", "Music", "Clickhouse",
  "Systems", "Algorithms", "Data Engineering", "S3", "System Design", "ETL",
];

export const timeline = [
  { date: "April 1998", title: "Born", detail: "The journey begins" },
  { date: "June 2016", title: "School", detail: "Dayawati Modi Academy" },
  { date: "Sep 2019", title: "First Job", detail: "BTM Financials" },
  { date: "Aug 2020", title: "Graduation", detail: "GLA University" },
  { date: "Dec 2020", title: "Juspay", detail: "Data Engineer" },
  { date: "Jan 2025", title: "Pixis.ai", detail: "Sr. Data Engineer" },
  { date: "Jun 2026", title: "Zycus", detail: "Staff Engineer" },
];

/**
 * Graph view: `level` is a self-rating out of 100, `related` is what sits
 * behind each skill and is shown when the skill is opened.
 */
export const skills = [
  {
    name: "Backend",
    level: 95,
    related: ["Go", "Rust", "Haskell", "Python", "GraphQl"],
  },
  {
    name: "Data Engineering",
    level: 90,
    related: ["Kafka", "Spark", "Flink", "Airflow/Prefect", "BigQuery"],
  },
  {
    name: "Databases Internals",
    level: 90,
    related: ["Postgres", "Clickhouse", "RocksDB", "Cassandra", "Redis"],
  },
  {
    name: "ETL",
    level: 85,
    related: ["CDC", "pgx copy", "Redshift", "BigQuery", "MySQL"],
  },
  {
    name: "Systems",
    level: 85,
    related: ["Linux", "Kubernetes", "Docker", "Nix", "AWS/GCP"],
  },
  {
    name: "Real-time Data Processing",
    level: 80,
    related: ["Kafka", "Warpstream", "Redis Streams", "Flink", "Clickhouse"],
  },
  {
    name: "Building Microservices",
    level: 85,
    related: ["Go", "GraphQl", "Kubernetes", "CI/CD", "Grafana"],
  },
  {
    name: "Data LakeHouse",
    level: 80,
    related: ["Iceberg", "Nessie", "Doris", "S3", "Spark"],
  },
];

/**
 * Radar view: four areas, each with three major and three minor contributors.
 * The numbers are self-ratings out of 100.
 * NOTE: names and numbers below are a first draft to be replaced with real ones.
 */
export const skillAreas = [
  {
    name: "Programming",
    major: [
      { name: "Go", level: 92 },
      { name: "Python", level: 88 },
      { name: "SQL", level: 90 },
    ],
    minor: [
      { name: "Rust", level: 86 },
      { name: "Haskell", level: 68 },
      { name: "Frontend and UI", level: 42 },
    ],
  },
  {
    name: "Architecture",
    major: [
      { name: "Database internals", level: 90 },
      { name: "Distributed systems", level: 93 },
      { name: "AI Agents", level: 80 },
      
    ],
    minor: [
      { name: "Data lakehouse", level: 80 },
      { name: "Analytics", level: 68 },
      { name: "Observability", level: 58 },
    ],
  },
  {
    name: "Leadership",
    major: [
      { name: "System design", level: 90 },
      { name: "Leading projects", level: 82 },
      { name: "Mentoring", level: 78 },
    ],
    minor: [
      { name: "Cost and performance", level: 72 },
      { name: "Release tooling", level: 60 },
      { name: "Client work", level: 48 },
    ],
  },
  {
    name: "Beyond code",
    major: [
      { name: "Writing", level: 80 },
      { name: "Parenting", level: 95 },
      { name: "Sports", level: 74 },
    ],
    minor: [
      { name: "Guitar", level: 58 },
      { name: "Anime", level: 80 },
      { name: "Travel", level: 40 },
    ],
  },
];

export const techStack = [
  {
    title: "Languages & Frameworks",
    items: [
      "Python", "Haskell", "Node.js", "Java", "Rust", "Go", "Bash", "SQL", "R",
      "GraphQl", "Flink", "Spark",
    ],
  },
  {
    title: "Databases",
    items: [
      "Iceberg", "Clickhouse", "MongoDB", "BigQuery", "Cassandra", "Doris",
      "Redis", "MySQL/Postgres", "ElasticSearch/Opensearch", "RedShift",
      "RocksDB", "vectoriaMetrics",
    ],
  },
  {
    title: "Tools & Services",
    items: [
      "Git", "Kubernetes", "CI/CD", "AWS/GCP", "Nix", "Nessie", "Lambda",
      "Docker", "Kafka", "Warpstream", "Grafana", "Airflow/Prefect",
    ],
  },
];

export const education = [
  {
    degree: "Bachelor of Computer Science (Specialization in Data Engineering)",
    school: "GLA University, Mathura",
    period: "2016 - 2020",
    description: "Specialized in Data Engineering and Data Warehousing.",
  },
];
