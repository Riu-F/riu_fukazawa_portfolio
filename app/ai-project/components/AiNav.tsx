"use client";

import Link from "next/link";

type NavCurrent = "home" | "about" | "ai" | "supermarket" | undefined;

export default function AiNav(params: { current?: NavCurrent }) {
  const { current } = params;

  return (
    <nav className="aip-nav-bar aip-nav-bar--desktop" aria-label="Site">
      <Link href="/" className={current === "home" ? "current" : undefined}>
        Home
      </Link>
      <span className="nav-divider" aria-hidden />
      <Link href="/ai-project" className={current === "ai" ? "current" : undefined}>
        AI × Design
      </Link>
      <span className="nav-divider" aria-hidden />
      <Link
        href="/super-market-navigation"
        className={current === "supermarket" ? "current" : undefined}
      >
        Supermarket
      </Link>
      <span className="nav-divider" aria-hidden />
      <Link href="/about" className={current === "about" ? "current" : undefined}>
        About
      </Link>
    </nav>
  );
}
