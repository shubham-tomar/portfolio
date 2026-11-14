import type { Metadata } from "next";
import { SocialRow } from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mx-auto max-w-2xl py-12">
        <h1 className="mb-10 text-center text-4xl text-ink sm:text-5xl">
          Contact Me
        </h1>

        <div className="panel">
          <div className="p-8">
            <p className="font-mono text-[0.75rem] text-muted">Email</p>
            <a
              href={`mailto:${site.email}`}
              className="mt-2 block text-xl font-medium break-all text-ink underline decoration-line decoration-1 underline-offset-8 transition-colors hover:text-accent hover:decoration-accent sm:text-2xl"
            >
              {site.email}
            </a>
          </div>

          <div className="border-t border-line p-8">
            <p className="font-mono text-[0.75rem] text-muted">Location</p>
            <p className="mt-2 text-lg text-ink">{site.location}</p>
          </div>

          <div className="border-t border-line p-8">
            <p className="mb-4 font-mono text-[0.75rem] text-muted">
              Connect with me
            </p>
            <SocialRow />
          </div>
        </div>
      </section>
    </main>
  );
}
