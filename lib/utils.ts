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

export function getReadingTime(content: string): number {
  // Remove HTML tags and get plain text
  const text = content.replace(/<[^>]*>/g, "");
  // Average reading speed is ~200-250 words per minute
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes); // At least 1 minute
}
