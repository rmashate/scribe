import slugify from "slugify";

export function generateSlug(title: string): string {
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getExcerpt(content: string, maxLength: number = 160): string {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, "");
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
