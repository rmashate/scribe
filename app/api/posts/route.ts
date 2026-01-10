import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug, getExcerpt } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, publish } = await request.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Generate slug from title
    let slug = generateSlug(title);

    // Ensure slug is unique for this user
    let counter = 1;
    let existingPost = await prisma.post.findUnique({
      where: {
        authorId_slug: {
          authorId: session.user.id,
          slug,
        },
      },
    });

    while (existingPost) {
      slug = `${generateSlug(title)}-${counter}`;
      counter++;
      existingPost = await prisma.post.findUnique({
        where: {
          authorId_slug: {
            authorId: session.user.id,
            slug,
          },
        },
      });
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content: content || "",
        excerpt: content ? getExcerpt(content) : null,
        published: !!publish,
        publishedAt: publish ? new Date() : null,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
