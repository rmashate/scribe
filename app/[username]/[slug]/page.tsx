import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, getReadingTime } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

async function getPost(username: string, slug: string) {
  // Remove @ prefix if present
  const cleanUsername = username.startsWith("@") ? username.slice(1) : username;

  const user = await prisma.user.findUnique({
    where: { username: cleanUsername },
  });

  if (!user) return null;

  return prisma.post.findUnique({
    where: {
      authorId_slug: {
        authorId: user.id,
        slug,
      },
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
  });
}

export async function generateMetadata({ params }: { params: Promise<{ username: string; slug: string }> }) {
  const { username, slug } = await params;
  const post = await getPost(username, slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: `${post.title} - Scribe`,
    description: post.excerpt || `Read ${post.title} by ${post.author.name || post.author.username}`,
  };
}

export default async function PostPage({ params }: { params: Promise<{ username: string; slug: string }> }) {
  const { username, slug } = await params;
  const post = await getPost(username, slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-3 text-muted-foreground">
              {post.author.image && (
                <img
                  src={post.author.image}
                  alt={post.author.name || post.author.username}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <Link
                  href={`/@${post.author.username}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {post.author.name || post.author.username}
                </Link>
                <p className="text-sm">
                  {formatDate(post.publishedAt || post.createdAt)} &middot; {getReadingTime(post.content)} min read
                </p>
              </div>
            </div>
          </header>

          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <footer className="mt-12 pt-8 border-t border-border">
            <Link
              href={`/@${post.author.username}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              &larr; More posts by {post.author.name || post.author.username}
            </Link>
          </footer>
        </article>
      </main>
      <Footer />
    </>
  );
}
