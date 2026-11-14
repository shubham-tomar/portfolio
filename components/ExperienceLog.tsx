import { BranchHeader } from "./git";

const gitColor = (n: number) => `var(--git-${((n - 1) % 6) + 1})`;

export type Role = {
  title: string;
  company: string;
  period: string;
  summary: string;
  points: React.ReactNode[];
};

/**
 * Work history as a sub-branch of the page's git graph: one commit per role,
 * newest first. GitRail (which must wrap this) runs the scroll behaviour.
 */
export function ExperienceLog({
  label,
  heading,
  color,
  roles,
}: {
  label: string;
  heading: string;
  color: number;
  roles: Role[];
}) {
  return (
    <section
      id="experience"
      className="py-16"
      style={{ "--c": gitColor(color) } as React.CSSProperties}
      data-git-section
    >
      <BranchHeader label={label} />
      <h2 className="mt-4 mb-10 text-3xl leading-tight text-ink sm:text-4xl">
        {heading}
      </h2>

      <div className="git-steps" data-git-steps>
        <span className="git-connector git-connector-stub" data-git-connector aria-hidden="true" />
        <span className="git-traveller" aria-hidden="true" />
        <ol>
          {roles.map((role, i) => (
            <li
              key={role.company}
              className="git-step git-commit"
              data-git-step
              style={
                {
                  "--step-color": gitColor(color + i),
                  "--step-next": gitColor(color + Math.min(i + 1, roles.length - 1)),
                  "--c": gitColor(color + i),
                } as React.CSSProperties
              }
            >
              <p className="git-step-label">
                <span className="git-node" data-git-node aria-hidden="true" />
                <span className="git-label">{role.period}</span>
              </p>
              <div className="git-step-body max-w-3xl">
                <h3 className="mt-3 text-2xl leading-snug font-semibold text-ink">
                  {role.title}
                </h3>
                <p className="mt-1 font-mono text-sm text-(--c)">{role.company}</p>
                {role.summary && (
                  <p className="mt-4 text-lg text-ink/90">{role.summary}</p>
                )}
                <ul className="log-list mt-4 text-muted">
                  {role.points.map((point, j) => (
                    <li key={j}>{point}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
