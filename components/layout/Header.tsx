"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-border">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Scribe
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/explore"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Explore
          </Link>
          {status === "loading" ? (
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href={`/@${session.user.username}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                My Blog
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign out
              </button>
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-8 h-8 rounded-full"
                />
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
