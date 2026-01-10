import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

async function getUserPosts(userId: string) {
  return prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { updatedAt: "desc" },
  });
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) return null;

  const posts = await getUserPosts(session.user.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Posts</h1>
          <p className="text-muted-foreground">
            Manage and create your blog posts
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          New Post
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="border border-border rounded-lg divide-y divide-border">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/edit/${post.id}`}
                    className="font-medium hover:underline truncate"
                  >
                    {post.title || "Untitled"}
                  </Link>
                  {post.published ? (
                    <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-0.5 rounded">
                      Published
                    </span>
                  ) : (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Updated {formatDate(post.updatedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {post.published && (
                  <Link
                    href={`/@${session.user.username}/${post.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    target="_blank"
                  >
                    View
                  </Link>
                )}
                <Link
                  href={`/dashboard/edit/${post.id}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <h3 className="font-medium mb-2">No posts yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first post to get started
          </p>
          <Link
            href="/dashboard/new"
            className="text-primary underline underline-offset-2"
          >
            Create a post
          </Link>
        </div>
      )}
    </div>
  );
}
