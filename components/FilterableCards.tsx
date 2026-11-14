"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { CardData } from "@/lib/data";
import { Card } from "./Card";

/** Card list with a category filter built from the cards themselves. */
export function FilterableCards({
  cards,
  emptyLabel,
}: {
  cards: CardData[];
  emptyLabel: string;
}) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", ...new Set(cards.map((card) => card.category))];
  const visible =
    filter === "All" ? cards : cards.filter((card) => card.category === filter);

  return (
    <>
      <div className="mb-12 flex flex-wrap justify-center" role="group" aria-label="Filter">
        {filters.map((name) => {
          const active = name === filter;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(name)}
              className={`-ml-px border px-5 py-2 font-mono text-[0.8rem] transition-colors first:ml-0 ${
                active
                  ? "z-10 border-accent bg-accent text-white"
                  : "border-line bg-surface text-muted hover:z-10 hover:border-accent hover:text-ink"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-10">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((card) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Card card={card} />
            </motion.div>
          ))}
        </AnimatePresence>
        {visible.length === 0 && (
          <p className="py-8 text-center text-muted">{emptyLabel}</p>
        )}
      </div>
    </>
  );
}
