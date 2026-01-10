"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Editor } from "@/components/editor/Editor";

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  slug: string;
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
      } catch {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  const handleSave = async (publish?: boolean) => {
    if (!title.trim()) {
      setError("Please add a title");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          publish: publish !== undefined ? publish : post?.published,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save post");
      }

      const updated = await res.json();
      setPost(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
      setDeleting(false);
    }
  };

  const handleTogglePublish = async () => {
    await handleSave(!post?.published);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-muted rounded mb-6" />
        <div className="h-12 w-full bg-muted rounded mb-4" />
        <div className="h-96 w-full bg-muted rounded" />
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="text-center py-16">
        <p className="text-destructive mb-4">{error}</p>
        <Link href="/dashboard" className="text-primary underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 text-sm text-destructive border border-destructive/50 rounded-md hover:bg-destructive/10 transition-colors disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleTogglePublish}
            disabled={saving}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {post?.published ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}

      {post?.published && (
        <div className="mb-4 p-3 text-sm bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-md flex items-center justify-between">
          <span>This post is published</span>
          <a
            href={`/@${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View post
          </a>
        </div>
      )}

      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground"
        />
        <Editor
          content={content}
          onChange={setContent}
          placeholder="Write your post content here..."
        />
      </div>
    </div>
  );
}
