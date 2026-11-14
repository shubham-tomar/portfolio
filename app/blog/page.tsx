import type { Metadata } from "next";
import { FilterableCards } from "@/components/FilterableCards";
import { allPosts } from "@/lib/data";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <main className="py-12">
      <section className="mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl text-ink sm:text-5xl">Blog</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            Thoughts, tutorials, and insights on technology and development
          </p>
        </div>
        <FilterableCards cards={allPosts()} emptyLabel="No blog posts found." />
      </section>
    </main>
  );
}
