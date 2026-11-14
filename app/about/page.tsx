import type { Metadata } from "next";
import Image from "next/image";
import { ExperienceLog, type Role } from "@/components/ExperienceLog";
import { Branch, GitRail } from "@/components/git";
import { SkillsExplorer } from "@/components/SkillsExplorer";
import profile from "@/public/assets/images/dp.jpg";
import { education, site, techStack } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-accent hover:text-accent-hover"
    >
      {children}
    </a>
  );
}

const roles: Role[] = [
  {
    title: "Staff Engineer",
    company: "Zycus",
    period: "Jun 2026 - Present",
    summary: "",
    points: [
      <>
        Zycus Data Platform: a company-wide analytics and reporting platform
        with custom CDC architecture streaming 200+ Postgres databases and 1k+
        tables into ClickHouse as the single source for analytics and
        reporting.
      </>,
      <>
        Building Merlin Insights, a chat-driven analytics layer where users
        query their data in natural language, blend their own data with Zycus
        data, and turn recurring questions into saved reports and dashboards.
      </>,
    ],
  },
  {
    title: "Senior Data Engineer",
    company: "Pixis.ai",
    period: "Jan 2025 - May 2026",
    summary:
      "Leading development of lakehouse architecture using Iceberg, nessie, warpstream(Kafka alternative), spark, prefect, Doris/veloDB, and other modern data engineering tools and frameworks, ingesting +500 Million events per day.",
    points: [
      <>
        Helped Pixis build{" "}
        <Ext href="https://interact.pixis.ai/interact">Interact</Ext>, an AI
        powered conversational analytics interface for marketing teams to query
        ad performance and receive actionable insights. Leveraged MongoDB to
        store dynamic queries, responses, and campaign metadata for personalized
        recommendations and traceability.
      </>,
      <>Developed Nessie go-client library for seamless interaction with Nessie catalog.</>,
      <>
        Developed icebridge microservice which acts as a bridge between Nessie
        catalog and other applications with Iceberg.
      </>,
      <>
        Contributed to open source{" "}
        <Ext href="https://github.com/apache/iceberg-go">apache/iceberg-go</Ext>{" "}
        library by adding{" "}
        <Ext href="https://github.com/apache/iceberg-go/pull/308">
          fix for createTable API
        </Ext>
        .
      </>,
      <>
        Migrated 4TB of Postgres data from non-partitioned to partitioned schema
        using custom built pgx-copy pipeline for faster data transfer. Improved
        query performance by 4x.
      </>,
    ],
  },
  {
    title: "Product Engineer - Data",
    company: "Juspay Technologies",
    period: "Dec 2020 - Dec 2024",
    summary:
      "Developed in house data platform to handle batch as well as real-time data processing using Kafka, cassandra, Clickhouse, and other modern data engineering tools and frameworks.",
    points: [
      <>
        Spearheaded the development of a robust ETL Data Framework for handling
        over 200 million transactions daily across diverse data sources (MySQL,
        Postgres, Kafka, Clickhouse, BigQuery), ensuring optimal monitoring,
        alerting, and data availability.
      </>,
      <>
        Engineered a high-throughput Real-Time Streaming pipeline, achieving
        ~350k logs/sec, integrating technologies such as Redis Streams,
        Cassandra, Kafka, and Clickhouse.
      </>,
      <>
        Achieved a significant reduction in data pipeline costs by approximately
        80% and enhanced analytical query performance by 10x, leveraging
        Clickhouse optimizations.
      </>,
      <>
        Pioneered the Autopilot platform for seamless cloud deployments
        (GCP/AWS), incorporating features like config control, staggered
        release, and autoscaling, enhancing deployment efficiency and cloud
        resource management.
      </>,
    ],
  },
  {
    title: "Software Engineer",
    company: "BTM Financial",
    period: "Sep 2019 - Dec 2020",
    summary:
      "Worked with various international clients to build and maintain their applications using modern tools and frameworks.",
    points: [
      <>
        Helped BTM setup RDBMS data source, design schema and data flow for a
        edTech website.
      </>,
      <>
        Created a pipeline to fetch tweets related to crypto currency and
        performed sentiment analysis using LSTM.
      </>,
      <>
        Migrate and automate quantitative regression tests from excel sheets to
        a python framework.
      </>,
    ],
  },
];

const facts = [
  { term: "Now", detail: `${roles[0].title}, ${roles[0].company}` },
  { term: "Based in", detail: site.location },
  { term: "Experience", detail: "7 years" },
  { term: "Focus", detail: "Data platforms and database internals" },
];

const sectionHeading = "mt-4 mb-8 text-3xl leading-tight text-ink sm:text-4xl";

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <GitRail>
        <Branch id="about" label="About" color={1}>
          <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
            <div>
              <h1 className="text-4xl leading-tight text-ink sm:text-5xl">
                About me
              </h1>
              <div className="mt-6 max-w-[62ch] space-y-4 text-lg text-muted">
                <p>
                  Hello! I&apos;m Shubham Tomar, a passionate software engineer
                  with around 7 years of experience in building robust and
                  scalable engineering solutions.
                </p>
                <p>
                  My journey in software development began with a curiosity
                  about how things work and a desire to create solutions that
                  make a difference.
                </p>
                <p>
                  I specialize in designing, building, and scaling distributed
                  backend systems, data engineering solutions, databases
                  internals and I&apos;m always exploring new technologies to
                  expand my skill set.
                </p>
              </div>
            </div>

            <figure className="portrait">
              <Image
                src={profile}
                alt={site.name}
                priority
                sizes="(min-width: 1024px) 304px, 100vw"
                className="aspect-[4/5] w-full object-cover object-[50%_30%]"
              />
            </figure>
          </div>

          <dl className="facts mt-10">
            {facts.map((fact) => (
              <div key={fact.term}>
                <dt>{fact.term}</dt>
                <dd>{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </Branch>

        <Branch id="skills" label="Skills" color={2}>
          <SkillsExplorer heading="What I work on" />
        </Branch>

        <Branch id="stack" label="Stack" color={3}>
          <h2 className={sectionHeading}>Tools I reach for</h2>
          <div className="stack-grid">
            {techStack.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                <ul className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="chip chip-lg">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Branch>

        <ExperienceLog
          label="Experience"
          heading="Where I’ve worked"
          color={4}
          roles={roles}
        />

        <Branch id="education" label="Education" color={1}>
          <h2 className={sectionHeading}>Education</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.degree} className="panel max-w-3xl p-6">
                <p className="font-mono text-[0.75rem] text-(--c) tabular-nums">
                  {edu.period}
                </p>
                <h3 className="mt-2 text-xl leading-snug font-semibold text-ink">
                  {edu.degree}
                </h3>
                <p className="mt-1 text-muted">{edu.school}</p>
                <p className="mt-3 text-muted">{edu.description}</p>
              </div>
            ))}
          </div>
        </Branch>
      </GitRail>
    </main>
  );
}
