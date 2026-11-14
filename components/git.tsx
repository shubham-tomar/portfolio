"use client";

import { useEffect, useRef } from "react";

/**
 * The page reads like a git graph. A `main` line runs down the left edge with
 * a dot that follows your reading position; at each section the dot runs out
 * along the branch to the section's commit, rings it, and comes back. The
 * journey section has its own line and its own dot, which sets off from where
 * the branch leaves and visits one commit per event.
 *
 * Everything is driven from one place (startGitGraph below): the dots follow
 * the scroll through a spring, so they ease instead of tracking it rigidly,
 * and all drawing is done by CSS reading the custom properties and
 * data-attributes set here. Nothing changes size, so the page never jumps.
 *
 * The markup is plain; see the `.git-*` rules in app/globals.css.
 */

/** How far down the viewport the reading position sits (0 = top, 1 = bottom). */
const READING_LINE = 0.7;
/** A dot moves sideways four times as fast as the page scrolls. */
const SIDE_COST = 0.25;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/* ---------- spring ---------- */

type Spring = { position: number | null; velocity: number; movedAt: number | null };
const newSpring = (): Spring => ({ position: null, velocity: 0, movedAt: null });

/** Moves the spring toward `target`; returns true once it has come to rest. */
function follow(spring: Spring, target: number, now: number, instant: boolean) {
  if (spring.position === null || instant) {
    spring.position = target;
    spring.velocity = 0;
    spring.movedAt = null;
    return true;
  }
  const dt = Math.min(0.05, spring.movedAt === null ? 1 / 60 : (now - spring.movedAt) / 1000);
  // Critically damped: quick to catch up, no overshoot.
  const accel = 196 * (target - spring.position) - 28 * spring.velocity;
  spring.velocity += accel * dt;
  spring.position += spring.velocity * dt;
  const rested = Math.abs(target - spring.position) < 0.5 && Math.abs(spring.velocity) < 5;
  if (rested) {
    spring.position = target;
    spring.velocity = 0;
    spring.movedAt = null;
  } else {
    spring.movedAt = now;
  }
  return rested;
}

/* ---------- small DOM helpers that only write when the value changes ---------- */

function setVar(el: HTMLElement, name: string, value: string) {
  if (el.style.getPropertyValue(name) !== value) el.style.setProperty(name, value);
}
function setFlag(el: HTMLElement, name: string, on: boolean) {
  const value = String(on);
  if (el.dataset[name] !== value) el.dataset[name] = value;
}

/* ---------- the engine ---------- */

function startGitGraph(root: HTMLElement) {
  const rail = root.querySelector<HTMLElement>("[data-git-rail]");
  if (!rail) return () => {};

  const stopEls = [...root.querySelectorAll<HTMLElement>("[data-git-stop]")];
  const stepAreas = [...root.querySelectorAll<HTMLElement>("[data-git-steps]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const spine = newSpring();
  const travellers = stepAreas.map(newSpring);
  let frame = 0;
  let layout: ReturnType<typeof measure> | null = null;

  /** Positions of everything, relative to the root. Recomputed only on resize. */
  function measure() {
    const rootRect = root.getBoundingClientRect();
    const railRect = rail!.getBoundingClientRect();
    const railX = railRect.left - rootRect.left + 0.5;
    const top = railRect.top - rootRect.top;

    // The main dot's route: down the rail, out to each commit and back.
    let distance = 0;
    let lastY = top;
    const stops = stopEls.map((el) => {
      const mark = el.querySelector<HTMLElement>("[data-git-mark]")!;
      const node = el.querySelector<HTMLElement>("[data-git-node]")!;
      const markRect = mark.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const y = markRect.top + markRect.height / 2 - rootRect.top;
      const run = Math.max(0, nodeRect.left + nodeRect.width / 2 - rootRect.left - railX);
      const detour = run * SIDE_COST;
      distance += y - lastY;
      lastY = y;
      const arriveAt = distance;
      const ringAt = arriveAt + detour;
      distance = ringAt + detour;
      // How much later than "level with it" the main dot rings this commit.
      return { el, mark, y, run, detour, arriveAt, ringAt, delay: ringAt - (y - top) };
    });
    const total = distance + (railRect.bottom - rootRect.top - lastY);

    // Each journey dot's route: in along the connector, then commit by commit.
    const areas = stepAreas.map((area) => {
      const areaRect = area.getBoundingClientRect();
      const mid = parseFloat(getComputedStyle(area).getPropertyValue("--step-mid")) || 12;
      const section = area.closest<HTMLElement>("[data-git-section]");
      const connector =
        [...(section?.querySelectorAll<HTMLElement>("[data-git-connector]") ?? [])].find(
          (el) => el.getClientRects().length > 0,
        ) ?? null;
      const lead = connector
        ? Math.max(0, areaRect.left + 0.5 - connector.getBoundingClientRect().left)
        : 0;
      const leadCost = lead * SIDE_COST;

      let along = leadCost;
      let previousY: number | null = null;
      const items = [...area.querySelectorAll<HTMLElement>("[data-git-step]")];
      const steps = items.map((el, i) => {
        const y = el.offsetTop + mid;
        const nodeRect = el.querySelector<HTMLElement>("[data-git-node]")!.getBoundingClientRect();
        const run = Math.max(0, nodeRect.left + nodeRect.width / 2 - areaRect.left - 0.5);
        const detour = run * SIDE_COST;
        const drop = y - (previousY ?? y);
        previousY = y;
        // Drop a little faster than the scroll to make up for the sideways trips.
        const leg = i === 0 ? 0 : Math.max(drop / 1.25 - 2 * detour, drop * 0.2);
        along += leg;
        const arriveAt = along;
        const ringAt = arriveAt + detour;
        const last = i === items.length - 1;
        along = ringAt + (last ? 0 : detour);
        return { el, y, drop, leg, run, detour, arriveAt, ringAt, last };
      });

      const stop = stops.find((s) => section?.contains(s.el));
      return {
        area,
        connector,
        top: areaRect.top - rootRect.top,
        lead,
        leadCost,
        steps,
        total: along,
        delay: stop?.delay ?? 0,
      };
    });

    return { railX, top, stops, total, areas };
  }

  function tick() {
    frame = 0;
    layout ??= measure();
    const { railX, top, stops, total, areas } = layout;
    const now = performance.now();
    const instant = reducedMotion.matches;
    const readingY = window.innerHeight * READING_LINE;
    const rootTop = root.getBoundingClientRect().top;

    /* main line */

    // At the very top of the page the dot starts at the top of the line, then
    // catches up with the reading position over the first stretch of scroll.
    const level = clamp(readingY - rootTop - top, 0, total);
    const headStart = Math.max(
      0,
      clamp(readingY - (rootTop + window.scrollY) - top, 0, total) - 16,
    );
    const caughtUp = headStart > 0 ? clamp(window.scrollY / headStart, 0, 1) : 1;
    // Both dots are held back by the same amount, so they stay in step.
    const heldBack = headStart * (1 - caughtUp);
    let rested = follow(spine, Math.max(0, level - heldBack), now, instant);
    const at = spine.position ?? 0;

    let dot = { x: railX, y: top };
    {
      let from = 0;
      let y = top;
      let placed = false;
      for (const stop of stops) {
        const back = stop.ringAt + stop.detour;
        if (at <= stop.arriveAt) dot = { x: railX, y: y + (at - from) };
        else if (at <= stop.ringAt)
          dot = { x: railX + (at - stop.arriveAt) / SIDE_COST, y: stop.y };
        else if (at <= back) dot = { x: railX + (back - at) / SIDE_COST, y: stop.y };
        else {
          from = back;
          y = stop.y;
          continue;
        }
        placed = true;
        break;
      }
      if (!placed) dot = { x: railX, y: y + (at - from) };
    }
    setVar(root, "--spine-fill", `${Math.max(0, dot.y - top).toFixed(1)}px`);
    setVar(root, "--spine-x", `${dot.x.toFixed(1)}px`);
    setVar(root, "--spine-y", `${dot.y.toFixed(1)}px`);

    for (const stop of stops) {
      const reached = at >= stop.ringAt - 0.5;
      setFlag(stop.el, "reached", reached);
      const filled = clamp((at - stop.arriveAt) / SIDE_COST, 0, stop.run);
      setVar(stop.mark, "--mark-fill", reached ? "100%" : `${filled.toFixed(1)}px`);
    }

    /* journey lines */

    areas.forEach((a, index) => {
      const spring = travellers[index];
      const areaTop = rootTop + a.top;
      const firstY = a.steps[0]?.y ?? 0;
      if (
        areaTop > window.innerHeight * 2 ||
        areaTop + a.area.offsetHeight < -window.innerHeight
      ) {
        spring.position = null; // far away: snap when it comes back
      }

      const areaLevel = readingY - areaTop - a.delay - heldBack;
      const travelling = areaLevel >= firstY;
      rested = follow(spring, clamp(areaLevel - firstY, 0, a.total), now, instant) && rested;
      const k = spring.position ?? 0;

      let pos = { x: 0, y: firstY };
      if (k <= a.leadCost && a.leadCost > 0) {
        pos = { x: k / SIDE_COST - a.lead, y: firstY };
      } else {
        let from = a.leadCost;
        let y = firstY;
        for (const step of a.steps) {
          const back = step.ringAt + step.detour;
          if (k <= step.arriveAt) {
            pos = { x: 0, y: y + (step.leg > 0 ? (k - from) / step.leg : 1) * step.drop };
          } else if (k <= step.ringAt) {
            pos = { x: (k - step.arriveAt) / SIDE_COST, y: step.y };
          } else if (step.last || k <= back) {
            pos = { x: step.last ? step.run : (back - k) / SIDE_COST, y: step.y };
          } else {
            from = back;
            y = step.y;
            continue;
          }
          break;
        }
      }

      let colorFrom = "";
      let colorTo = "";
      let mix = 0;
      a.steps.forEach((step, i) => {
        const nextY = a.steps[i + 1]?.y;
        const progress =
          nextY === undefined ? 0 : clamp((pos.y - step.y) / (nextY - step.y), 0, 1);
        const reached = travelling && k >= step.ringAt - 0.5;
        setFlag(step.el, "reached", reached);
        setVar(step.el, "--step-progress", progress.toFixed(4));
        const filled = clamp((k - step.arriveAt) / SIDE_COST, 0, step.run);
        setVar(step.el, "--step-run", reached ? "100%" : `${filled.toFixed(1)}px`);
        if (reached || i === 0) {
          colorFrom = step.el.style.getPropertyValue("--step-color");
          colorTo = step.el.style.getPropertyValue("--step-next");
          mix = progress;
        }
      });

      setFlag(a.area, "travelling", travelling);
      setFlag(a.area, "arrived", travelling && k >= a.total - 0.5);
      setVar(a.area, "--travel-from", colorFrom);
      setVar(a.area, "--travel-to", colorTo);
      setVar(a.area, "--travel-mix", `${(mix * 100).toFixed(1)}%`);
      setVar(a.area, "--travel-x", `${pos.x.toFixed(1)}px`);
      setVar(a.area, "--travel-y", `${pos.y.toFixed(1)}px`);
      if (a.connector) {
        const fill = !travelling
          ? "0px"
          : k >= a.leadCost
            ? "100%"
            : `${(k / SIDE_COST).toFixed(1)}px`;
        setVar(a.connector, "--connector-fill", fill);
      }
    });

    if (!rested) schedule();
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(tick);
  }
  function remeasure() {
    layout = null;
    schedule();
  }

  root.dataset.git = "on";
  const observer = new ResizeObserver(remeasure);
  observer.observe(root);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", remeasure);
  reducedMotion.addEventListener("change", schedule);
  schedule();

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", remeasure);
    reducedMotion.removeEventListener("change", schedule);
    delete root.dataset.git;
  };
}

/* ---------- markup ---------- */

/** Sets the branch colour (`--c`) for everything inside. */
export const branchColor = (n: number) =>
  ({ "--c": `var(--git-${((n - 1) % 6) + 1})` }) as React.CSSProperties;

/** Wraps the page, draws the main line and runs the graph. */
export function GitRail({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? startGitGraph(ref.current) : undefined), []);

  return (
    <div ref={ref} className="git-root">
      <div className="git-rail" data-git-rail aria-hidden="true" />
      <div className="git-spine-fill" aria-hidden="true" />
      <div className="git-spine-dot" aria-hidden="true" />
      {children}
    </div>
  );
}

/**
 * Row where a branch leaves `main`: stub, commit dot, label, trailing line.
 * With `connector`, the trailing line leads into a journey line (wide screens).
 */
export function BranchHeader({
  label,
  connector = false,
}: {
  label: string;
  connector?: boolean;
}) {
  return (
    <div className="git-eyebrow git-commit" data-git-stop>
      <span className="git-mark" data-git-mark aria-hidden="true" />
      <span className="git-node" data-git-node aria-hidden="true" />
      <span className="git-label">{label}</span>
      {connector ? (
        <span
          className="git-connector hidden min-w-0 flex-1 lg:block"
          data-git-connector
          aria-hidden="true"
        />
      ) : (
        <span className="git-trail" aria-hidden="true" />
      )}
    </div>
  );
}

/** A page section hanging off `main`. */
export function Branch({
  id,
  label,
  color,
  children,
}: {
  id: string;
  label: string;
  color: number;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="py-16" style={branchColor(color)} data-git-section>
      <BranchHeader label={label} />
      {children}
    </section>
  );
}
