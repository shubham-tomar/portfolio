import { timeline } from "@/lib/site";
import { BranchHeader } from "./git";

const gitColor = (n: number) => `var(--git-${((n - 1) % 6) + 1})`;

/**
 * The journey: a sub-branch with one commit per event. The scroll behaviour
 * (the travelling dot, lines filling, commits lighting up) is run by GitRail;
 * this is only the markup it works on.
 */
export function Timeline() {
  return (
    <section
      id="timeline"
      className="py-16"
      style={{ "--c": gitColor(1) } as React.CSSProperties}
      data-git-section
    >
      <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div>
          <BranchHeader label="The journey" connector />
          <h2 className="mt-4 pr-10 text-3xl leading-tight text-ink sm:text-4xl">
            My Professional Journey
          </h2>
          <p className="mt-4 max-w-md pr-10 text-lg text-muted">
            From school to building a data platform at Zycus, one commit at a time.
          </p>
        </div>

        <div className="git-steps mt-10 lg:mt-0" data-git-steps>
          {/* Below the two-column layout the journey leaves `main` right here. */}
          <span
            className="git-connector git-connector-stub lg:hidden"
            data-git-connector
            aria-hidden="true"
          />
          <span className="git-traveller" aria-hidden="true" />
          <ol>
            {timeline.map((event, i) => (
              <li
                key={event.date}
                className="git-step git-commit"
                data-git-step
                style={
                  {
                    "--step-color": gitColor(i + 1),
                    "--step-next": gitColor(Math.min(i + 2, timeline.length)),
                    "--c": gitColor(i + 1),
                  } as React.CSSProperties
                }
              >
                <p className="git-step-label">
                  <span className="git-node" data-git-node aria-hidden="true" />
                  <span className="git-label">{event.date}</span>
                </p>
                <h3 className="git-step-title text-2xl font-semibold text-ink">
                  {event.title}
                </h3>
                <p className="git-step-text text-muted">{event.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
