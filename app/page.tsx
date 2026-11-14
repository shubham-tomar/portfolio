import Link from "next/link";
import { Card } from "@/components/Card";
import { Branch, GitRail } from "@/components/git";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { Timeline } from "@/components/Timeline";
import { featuredProjects, recentPosts, type CardData } from "@/lib/data";

function CardBranch({
  id,
  label,
  color,
  title,
  cards,
  columns,
  href,
  cta,
}: {
  id: string;
  label: string;
  color: number;
  title: string;
  cards: CardData[];
  columns: string;
  href: string;
  cta: string;
}) {
  return (
    <Branch id={id} label={label} color={color}>
      <h2 className="mt-4 mb-8 text-3xl leading-tight text-ink sm:text-4xl">
        {title}
      </h2>
      <div className={`grid gap-8 ${columns}`}>
        {cards.map((card, i) => (
          <Reveal key={card.id} delay={i * 0.1} className="[&>article]:h-full">
            <Card card={card} />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8" y={20}>
        <Link
          href={href}
          className="btn"
        >
          {cta}
        </Link>
      </Reveal>
    </Branch>
  );
}

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <GitRail>
        <Hero />

        <div className="mt-14">
          <Timeline />

          <CardBranch
            id="projects-section"
            label="Projects"
            color={2}
            title="Featured Projects"
            cards={featuredProjects()}
            columns="md:grid-cols-2 xl:grid-cols-3"
            href="/projects"
            cta="View All Projects →"
          />

          <CardBranch
            id="blogs-section"
            label="Writing"
            color={3}
            title="Recent Articles"
            cards={recentPosts()}
            columns="md:grid-cols-2"
            href="/blog"
            cta="Read All Articles →"
          />
        </div>
      </GitRail>
    </main>
  );
}
