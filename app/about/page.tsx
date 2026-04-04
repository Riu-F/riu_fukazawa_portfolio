import type { Viewport } from "next";
import "./about.css";
import AboutBoard from "./components/AboutBoard";
import { loadAboutBoardItems } from "./lib/loadBoardItems";

export const metadata = {
  title: "About — Riu",
  description: "A large, pannable About Me board.",
};

/**
 * Locks browser pinch/page zoom on this route so the board isn’t fighting OS scaling.
 * Tradeoff: users who rely on pinch-to-zoom for the mobile text fallback lose that;
 * see README (About) for details.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function AboutPage() {
  const items = await loadAboutBoardItems();
  return <AboutBoard initialItems={items} />;
}
