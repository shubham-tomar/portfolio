import { iconPaths, type IconName } from "@/lib/icon-paths";

export function SocialIcon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}
