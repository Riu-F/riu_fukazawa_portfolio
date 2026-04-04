"use client";

import Link from "next/link";

type NavCurrent = "home" | "about" | "ai" | undefined;

export default function AiNav(params: { current?: NavCurrent }) {
  const { current } = params;
  const aiActive = current !== "home" && current !== "about";

  return (
    <nav className="aip-nav-bar aip-nav-bar--desktop" aria-label="Site">
      <Link href="/" className={current === "home" ? "current" : undefined}>
        Home
      </Link>
      <span className="nav-divider" aria-hidden />
      <Link href="/ai-project" className={aiActive ? "current" : undefined}>
        AI × Design
      </Link>
      <span className="nav-divider" aria-hidden />
      <Link href="/about" className={current === "about" ? "current" : undefined}>
        About
      </Link>
    </nav>
  );
}
