import type { Metadata } from "next";
import { FilterableCards } from "@/components/FilterableCards";
import { allProjects } from "@/lib/data";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <main className="py-12">
      <section className="mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl text-ink sm:text-5xl">My Projects</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            A collection of my work and side projects
          </p>
        </div>
        <FilterableCards cards={allProjects()} emptyLabel="No projects found." />
      </section>
    </main>
  );
}
