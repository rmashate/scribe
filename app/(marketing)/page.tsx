import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

type PostWithAuthor = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  author: {
    name: string | null;
    username: string;
    image: string | null;
  };
};

async function getFeaturedPosts(): Promise<PostWithAuthor[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
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
      take: 6,
    });
    return posts;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const posts = await getFeaturedPosts();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Write. Publish. Share.
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Scribe is the simplest way to start your blog. No complexity, no friction.
              Just sign up and start writing.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/login"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Start Writing
              </Link>
              <Link
                href="#featured"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Explore blogs
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12">
              Everything you need. Nothing you don&apos;t.
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Sign Up</h3>
                <p className="text-sm text-muted-foreground">
                  One click with GitHub. No forms, no verification emails.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Write</h3>
                <p className="text-sm text-muted-foreground">
                  A beautiful rich text editor. Focus on your words.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Publish</h3>
                <p className="text-sm text-muted-foreground">
                  Share your thoughts with the world instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts Section */}
        <section id="featured" className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Recent Posts</h2>
            {posts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="border border-border rounded-lg p-6 hover:border-foreground/20 transition-colors"
                  >
                    <Link href={`/@${post.author.username}/${post.slug}`}>
                      <h3 className="font-semibold mb-2 hover:underline">
                        {post.title}
                      </h3>
                    </Link>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {post.author.image && (
                        <img
                          src={post.author.image}
                          alt={post.author.name || post.author.username}
                          className="w-5 h-5 rounded-full"
                        />
                      )}
                      <span>{post.author.name || post.author.username}</span>
                      <span>&middot;</span>
                      <time>{formatDate(post.publishedAt || post.createdAt)}</time>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground mb-4">
                  No posts yet. Be the first to write!
                </p>
                <Link
                  href="/login"
                  className="text-primary underline underline-offset-2"
                >
                  Start your blog
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
