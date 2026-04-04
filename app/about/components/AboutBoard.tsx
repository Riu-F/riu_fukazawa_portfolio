"use client";

import { useEffect, useMemo, useState } from "react";
import type { BoardItem } from "../types";
import AiNav from "../../ai-project/components/AiNav";
import DesktopAboutBoard from "./DesktopAboutBoard";
import MobileAboutBoard from "./MobileAboutBoard";

/** Viewport width at or above this uses the freeform board; below uses the mobile layout. */
export const ABOUT_DESKTOP_LAYOUT_MIN_PX = 900;

function useIsDesktopAboutLayout() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${ABOUT_DESKTOP_LAYOUT_MIN_PX}px)`);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

export default function AboutBoard({ initialItems }: { initialItems: BoardItem[] }) {
  const isDesktopLayout = useIsDesktopAboutLayout();

  const boardSize = useMemo(() => ({ width: 8000, height: 5000 }), []);

  const initialFocus = useMemo(() => {
    const intro = initialItems.find((i) => i.id === "intro");
    return { x: intro?.x ?? boardSize.width / 2, y: intro?.y ?? boardSize.height / 2 };
  }, [boardSize.height, boardSize.width, initialItems]);

  return (
    <main
      className={`about ${isDesktopLayout ? "about--layout-desktop" : "about--layout-mobile"}`}
    >
      <AiNav current="about" />
      {isDesktopLayout ? (
        <DesktopAboutBoard
          items={initialItems}
          boardWidth={boardSize.width}
          boardHeight={boardSize.height}
          initialFocus={initialFocus}
        />
      ) : (
        <MobileAboutBoard items={initialItems} />
      )}
    </main>
  );
}
