import type { CardData } from "@/lib/data";

/** One card layout shared by projects and blog posts. */
export function Card({ card }: { card: CardData }) {
  return (
    <article className="panel panel-lift flex h-full flex-col">
      <div className="relative border-b border-line">
        <img
          className="h-48 w-full object-cover"
          src={card.image}
          alt={card.title}
          loading="lazy"
        />
        <span className="absolute top-0 left-0 bg-page px-3 py-1.5 font-mono text-[0.7rem] text-ink">
          {card.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {card.date && (
          <p className="mb-2 font-mono text-[0.75rem] text-muted tabular-nums">
            {card.date}
          </p>
        )}
        <h3 className="mb-3 text-xl leading-snug font-semibold text-ink">
          {card.title}
        </h3>
        <p className="mb-5 text-muted">{card.body}</p>

        {card.tags && (
          <ul className="mb-5 flex flex-wrap gap-1.5">
            {card.tags.map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>
        )}

        {card.links.length > 0 && (
          <div className="mt-auto flex gap-5 font-mono text-[0.8rem]">
            {card.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline decoration-1 underline-offset-4 transition-colors ${
                  link.tone === "accent"
                    ? "text-accent hover:text-accent-hover"
                    : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
