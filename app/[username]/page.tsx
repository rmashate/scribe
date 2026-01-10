import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

async function getUser(username: string) {
  // Remove @ prefix if present
  const cleanUsername = username.startsWith("@") ? username.slice(1) : username;

  return prisma.user.findUnique({
    where: { username: cleanUsername },
    include: {
      posts: {
        where: { published: true },
        orderBy: { publishedAt: "desc" },
      },
    },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    return { title: "User not found" };
  }

  return {
    title: `${user.name || user.username} - Scribe`,
    description: user.bio || `Read posts by ${user.name || user.username}`,
  };
}

export default async function UserBlogPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <header className="mb-12 text-center">
          {user.image && (
            <img
              src={user.image}
              alt={user.name || user.username}
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
          )}
          <h1 className="text-3xl font-bold">{user.name || user.username}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
          {user.bio && (
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              {user.bio}
            </p>
          )}
          <a
            href={`/@${user.username}/feed.xml`}
            className="inline-flex items-center gap-2 mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            title="RSS Feed"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
            </svg>
            Subscribe via RSS
          </a>
        </header>

        {user.posts.length > 0 ? (
          <div className="space-y-8">
            {user.posts.map((post) => (
              <article key={post.id} className="border-b border-border pb-8 last:border-0">
                <Link href={`/@${user.username}/${post.slug}`}>
                  <h2 className="text-xl font-semibold hover:underline mb-2">
                    {post.title}
                  </h2>
                </Link>
                {post.excerpt && (
                  <p className="text-muted-foreground mb-3">{post.excerpt}</p>
                )}
                <time className="text-sm text-muted-foreground">
                  {formatDate(post.publishedAt || post.createdAt)}
                </time>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No published posts yet.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
