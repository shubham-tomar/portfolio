"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { skillAreas, skills } from "@/lib/site";

/**
 * Two ways of showing skills, switched by a toggle so they can be compared:
 * a radar of four areas, and a node graph where clicking a skill opens it.
 * Once one is chosen, delete the other view and the toggle.
 */

const gitColor = (n: number) => `var(--git-${(n % 6) + 1})`;
const TAU = Math.PI * 2;
/** Evenly spaced directions, starting straight up. */
const angleOf = (i: number, count: number) => -Math.PI / 2 + (i / count) * TAU;
const pct = (n: number) => `${n.toFixed(2)}%`;
const xy = (angle: number, radius: number) =>
  `${(Math.cos(angle) * radius).toFixed(2)},${(Math.sin(angle) * radius).toFixed(2)}`;

/* ---------- radar ---------- */

// Each area owns a quarter of the circle and has six spokes in it: its three
// major contributors, then its three minor ones.
const SPOKES_PER_AREA = 6;
const SPOKES = skillAreas.length * SPOKES_PER_AREA;
/** Spokes sit in the middle of their slot, so areas never share a spoke. */
const spokeAngle = (index: number) => angleOf(index + 0.5, SPOKES);

// The axis runs from 25 at the centre to 100 at the rim; the rings are labelled.
const RADAR_MIN = 25;
const RADAR_RINGS = [40, 60, 80, 100];
const radarRadius = (level: number) => ((level - RADAR_MIN) / (100 - RADAR_MIN)) * 50;

const radarAreas = skillAreas.map((area, a) => ({
  name: area.name,
  color: gitColor(a + 1),
  // Label goes outside the middle of the area's quarter.
  labelAngle: angleOf((a + 0.5) * SPOKES_PER_AREA, SPOKES),
  points: [
    ...area.major.map((item) => ({ ...item, minor: false })),
    ...area.minor.map((item) => ({ ...item, minor: true })),
  ].map((item, i) => ({
    ...item,
    id: `${area.name}/${item.name}`,
    angle: spokeAngle(a * SPOKES_PER_AREA + i),
  })),
}));

const ringPath = (radius: number) =>
  Array.from({ length: 72 }, (_, i) => xy(angleOf(i, 72), radius)).join(" ");

function Radar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  // The point under the pointer (or the focused list row); chart and list share it.
  const [active, setActive] = useState<string | null>(null);
  const activeArea = radarAreas.find((area) => area.points.some((p) => p.id === active));
  const activePoint = activeArea?.points.find((p) => p.id === active);

  return (
    <div
      ref={ref}
      className={`grid items-center lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] ${inView ? "is-in" : ""}`}
    >
      <div className="radar">
        <div className="radar-chart">
          <svg
            viewBox="-50 -50 100 100"
            role="img"
            aria-label="Radar chart of self-ratings across four areas; the same numbers are listed beside it"
          >
            {[...RADAR_RINGS].reverse().map((ring) => (
              <polygon
                key={ring}
                className="radar-ring"
                points={ringPath(radarRadius(ring))}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {radarAreas.map((area) => (
              <g key={area.name} style={{ "--c": area.color } as React.CSSProperties}>
                {area.points.map((point) => (
                  <line
                    key={point.name}
                    className="radar-axis"
                    x1={0}
                    y1={0}
                    x2={(Math.cos(point.angle) * 50).toFixed(2)}
                    y2={(Math.sin(point.angle) * 50).toFixed(2)}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                {/* One blade per area: out from the centre, round its six points, back in. */}
                <polygon
                  className="radar-shape"
                  points={[
                    "0,0",
                    ...area.points.map((point) => xy(point.angle, radarRadius(point.level))),
                  ].join(" ")}
                  vectorEffect="non-scaling-stroke"
                />
                {area.points.map((point) => (
                  <circle
                    key={point.name}
                    className={`radar-dot ${point.minor ? "is-minor" : ""} ${
                      point.id === active ? "is-active" : ""
                    }`}
                    cx={(Math.cos(point.angle) * radarRadius(point.level)).toFixed(2)}
                    cy={(Math.sin(point.angle) * radarRadius(point.level)).toFixed(2)}
                    r={point.minor ? 1 : 1.4}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                {/* Larger invisible targets, so the small dots are easy to hit. */}
                {area.points.map((point) => (
                  <circle
                    key={point.name}
                    className="radar-hit"
                    cx={(Math.cos(point.angle) * radarRadius(point.level)).toFixed(2)}
                    cy={(Math.sin(point.angle) * radarRadius(point.level)).toFixed(2)}
                    r={3.6}
                    onPointerEnter={() => setActive(point.id)}
                    onPointerLeave={() => setActive(null)}
                  />
                ))}
              </g>
            ))}
          </svg>

          {RADAR_RINGS.map((ring) => (
            <span
              key={ring}
              className="radar-tick"
              aria-hidden="true"
              style={{ left: "50%", top: pct(50 - radarRadius(ring)) }}
            >
              {ring}
            </span>
          ))}

          {radarAreas.map((area) => {
            const x = Math.cos(area.labelAngle);
            const y = Math.sin(area.labelAngle);
            return (
              <span
                key={area.name}
                className="radar-label"
                style={
                  {
                    "--c": area.color,
                    left: pct(50 + x * 54),
                    top: pct(50 + y * 54),
                    translate: `${x > 0 ? "0%" : "-100%"} ${y > 0 ? "0%" : "-100%"}`,
                  } as React.CSSProperties
                }
              >
                {area.name}
              </span>
            );
          })}

          {activeArea && activePoint && (
            <span
              className="radar-tip"
              role="status"
              style={
                {
                  "--c": activeArea.color,
                  left: pct(50 + Math.cos(activePoint.angle) * radarRadius(activePoint.level)),
                  top: pct(50 + Math.sin(activePoint.angle) * radarRadius(activePoint.level)),
                } as React.CSSProperties
              }
            >
              {activePoint.name} <b>{activePoint.level}</b>
              <i>
                {activeArea.name}, {activePoint.minor ? "minor" : "major"}
              </i>
            </span>
          )}
        </div>
      </div>

      {/* The same data as text: every point on the chart, with its number. */}
      <div className="grid gap-px border-t border-line bg-line sm:grid-cols-2 lg:border-t-0 lg:border-l">
        {radarAreas.map((area) => (
          <div
            key={area.name}
            className="bg-surface p-5"
            style={{ "--c": area.color } as React.CSSProperties}
          >
            <h3 className="mb-3 font-mono text-[0.8rem] font-medium tracking-normal text-(--c)">
              {area.name}
            </h3>
            <ul className="text-sm">
              {area.points.map((point) => (
                <li
                  key={point.name}
                  tabIndex={0}
                  className={`radar-row ${point.id === active ? "is-active" : ""}`}
                  onPointerEnter={() => setActive(point.id)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(point.id)}
                  onBlur={() => setActive(null)}
                >
                  <span
                    aria-hidden="true"
                    className={`size-2 shrink-0 rounded-full border border-(--c) ${
                      point.minor ? "" : "bg-(--c)"
                    }`}
                  />
                  <span className={point.minor ? "text-muted" : "text-ink"}>{point.name}</span>
                  <span className="ml-auto font-mono text-[0.75rem] text-muted tabular-nums">
                    {point.level}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- node graph ---------- */

// Ring size as a share of the box, so it works at any width.
const RING_X = 37;
const RING_Y = 32;
// The hub sits a little above the middle, leaving room for the hint below.
const HUB_Y = 45;

function Graph() {
  const [open, setOpen] = useState<string | null>(null);
  const openIndex = skills.findIndex((skill) => skill.name === open);
  const openSkill = skills[openIndex];

  const ring = openSkill
    ? openSkill.related.map((name) => ({ name, level: undefined, color: gitColor(openIndex) }))
    : skills.map((skill, i) => ({ name: skill.name, level: skill.level, color: gitColor(i) }));

  const placed = ring.map((item, i) => {
    const a = angleOf(i, ring.length);
    return { ...item, x: 50 + Math.cos(a) * RING_X, y: HUB_Y + Math.sin(a) * RING_Y };
  });
  const view = open ?? "all";
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="skill-graph">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <AnimatePresence>
          {placed.map((item, i) => (
            <motion.line
              key={`${view}:${item.name}`}
              style={{ "--c": item.color } as React.CSSProperties}
              x1={50}
              y1={HUB_Y}
              vectorEffect="non-scaling-stroke"
              initial={{ x2: 50, y2: HUB_Y, opacity: 0 }}
              animate={{ x2: item.x, y2: item.y, opacity: 1 }}
              exit={{ x2: 50, y2: HUB_Y, opacity: 0 }}
              transition={{ duration: 0.5, delay: i * 0.04, ease }}
            />
          ))}
        </AnimatePresence>
      </svg>

      <AnimatePresence>
        {placed.map((item, i) => {
          const motionProps = {
            style: { "--c": item.color } as React.CSSProperties,
            initial: { left: "50%", top: pct(HUB_Y), opacity: 0 },
            animate: { left: pct(item.x), top: pct(item.y), opacity: 1 },
            exit: { left: "50%", top: pct(HUB_Y), opacity: 0 },
            transition: { duration: 0.5, delay: i * 0.04, ease },
          };
          const label = (
            <>
              <span className="skill-node-dot" />
              <span className="skill-node-label">
                {item.name}
                {item.level !== undefined && <b>{item.level}</b>}
              </span>
            </>
          );
          // Skills can be opened; the things behind a skill are just shown.
          return openSkill ? (
            <motion.span key={`${view}:${item.name}`} className="skill-node" {...motionProps}>
              {label}
            </motion.span>
          ) : (
            <motion.button
              key={`${view}:${item.name}`}
              type="button"
              className="skill-node"
              aria-label={`${item.name}, ${item.level} out of 100. Show what is behind it.`}
              onClick={() => setOpen(item.name)}
              {...motionProps}
            >
              {label}
            </motion.button>
          );
        })}
      </AnimatePresence>

      {openSkill ? (
        <button
          type="button"
          className="skill-node is-hub"
          style={{ left: "50%", top: pct(HUB_Y), "--c": gitColor(openIndex) } as React.CSSProperties}
          aria-label="Back to all skills"
          onClick={() => setOpen(null)}
        >
          <span className="skill-node-dot" />
          <span className="skill-node-label">
            {openSkill.name}
            <b>{openSkill.level}</b>
          </span>
        </button>
      ) : (
        <span
          className="skill-node is-hub"
          style={
            { left: "50%", top: pct(HUB_Y), "--c": "var(--text-secondary)" } as React.CSSProperties
          }
        >
          <span className="skill-node-dot" />
          <span className="skill-node-label">Skills</span>
        </span>
      )}

      <p className="absolute right-4 bottom-3 left-4 text-center text-sm text-muted">
        {openSkill ? "Select the centre to go back." : "Select a skill to see what is behind it."}
      </p>
    </div>
  );
}

/* ---------- section body with the toggle ---------- */

const views = [
  { id: "radar", label: "Radar" },
  { id: "graph", label: "Graph" },
] as const;

export function SkillsExplorer({ heading }: { heading: string }) {
  const [view, setView] = useState<(typeof views)[number]["id"]>("radar");

  return (
    <>
      <div className="mt-4 mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-3xl leading-tight text-ink sm:text-4xl">{heading}</h2>
        <div className="flex" role="group" aria-label="Skills view">
          {views.map((option) => {
            const active = option.id === view;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => setView(option.id)}
                className={`-ml-px border px-4 py-1.5 font-mono text-[0.75rem] transition-colors first:ml-0 ${
                  active
                    ? "z-10 border-(--c) bg-(--c) text-page"
                    : "border-line text-muted hover:z-10 hover:border-(--c) hover:text-ink"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="panel skills-view">{view === "radar" ? <Radar /> : <Graph />}</div>
    </>
  );
}
