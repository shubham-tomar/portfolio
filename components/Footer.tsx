import Link from "next/link";
import { navLinks, site, socials } from "@/lib/site";
import { SocialIcon } from "./SocialIcon";

// Footer order on the old site: LinkedIn, GitHub, Medium, Instagram.
const footerOrder = ["LinkedIn", "GitHub", "Medium", "Instagram"];
const footerSocials = footerOrder.flatMap(
  (name) => socials.find((s) => s.name === name) ?? [],
);

/** Social links as a row of square cells. */
export function SocialRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex ${className}`}>
      {footerSocials.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className="-ml-px grid size-11 place-items-center border border-line text-muted transition-colors first:ml-0 hover:z-10 hover:border-accent hover:text-accent"
        >
          <SocialIcon name={social.icon} className="size-5" />
        </a>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-12 border-t border-line">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-lg font-semibold tracking-tight text-ink">
              {site.name}
            </p>
            <p className="mt-1 text-muted">{site.role}</p>
          </div>

          <SocialRow />

          <nav
            className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.8rem]"
            aria-label="Footer"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-10 text-sm text-muted">
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
