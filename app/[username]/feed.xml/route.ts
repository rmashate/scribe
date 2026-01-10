import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getExcerpt } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const cleanUsername = username.startsWith("@") ? username.slice(1) : username;

  const user = await prisma.user.findUnique({
    where: { username: cleanUsername },
    include: {
      posts: {
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: 20,
      },
    },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://scribe.vercel.app";
  const blogUrl = `${baseUrl}/@${user.username}`;

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(user.name || user.username)} - Scribe</title>
    <link>${blogUrl}</link>
    <description>${escapeXml(user.bio || `Posts by ${user.name || user.username}`)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${blogUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${user.posts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/@${user.username}/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/@${user.username}/${post.slug}</guid>
      <description>${escapeXml(post.excerpt || getExcerpt(post.content))}</description>
      <pubDate>${(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
