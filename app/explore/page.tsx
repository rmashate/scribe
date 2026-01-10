import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { formatDate, getReadingTime } from "@/lib/utils";
import { SearchBar } from "@/components/explore/SearchBar";

type PostWithAuthor = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  author: {
    name: string | null;
    username: string;
    image: string | null;
  };
};

async function getPosts(search?: string): Promise<PostWithAuthor[]> {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      author: {
        select: {
          name: true,
          username: true,
          image: true,
        },
      },
    },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });
  return posts;
}

export const metadata = {
  title: "Explore - Scribe",
  description: "Discover posts from writers on Scribe",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const posts = await getPosts(q);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore</h1>
          <p className="text-muted-foreground">
            Discover posts from writers on Scribe
          </p>
        </div>

        <SearchBar initialQuery={q} />

        {posts.length > 0 ? (
          <div className="grid gap-6 mt-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="border border-border rounded-lg p-6 hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link href={`/@${post.author.username}/${post.slug}`}>
                      <h2 className="text-xl font-semibold hover:underline mb-2">
                        {post.title}
                      </h2>
                    </Link>
                    {post.excerpt && (
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Link
                        href={`/@${post.author.username}`}
                        className="flex items-center gap-2 hover:text-foreground transition-colors"
                      >
                        {post.author.image && (
                          <img
                            src={post.author.image}
                            alt={post.author.name || post.author.username}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span>{post.author.name || post.author.username}</span>
                      </Link>
                      <span>&middot;</span>
                      <time>{formatDate(post.publishedAt || post.createdAt)}</time>
                      <span>&middot;</span>
                      <span>{getReadingTime(post.content)} min read</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border rounded-lg mt-8">
            {q ? (
              <>
                <p className="text-muted-foreground mb-2">
                  No posts found for &quot;{q}&quot;
                </p>
                <Link href="/explore" className="text-primary underline">
                  Clear search
                </Link>
              </>
            ) : (
              <p className="text-muted-foreground">No posts yet. Be the first to write!</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
