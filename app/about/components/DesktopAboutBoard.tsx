"use client";

import type { BoardItem } from "../types";
import BoardViewport from "./BoardViewport";

type Point = { x: number; y: number };

/**
 * Freeform desktop canvas only. Mounted when the layout breakpoint is “desktop”.
 * `isDesktop` is always true here because the viewport is not shown on narrow viewports.
 */
export default function DesktopAboutBoard(params: {
  items: BoardItem[];
  boardWidth: number;
  boardHeight: number;
  initialFocus: Point;
}) {
  const { items, boardWidth, boardHeight, initialFocus } = params;

  return (
    <BoardViewport
      boardWidth={boardWidth}
      boardHeight={boardHeight}
      initialFocus={initialFocus}
      items={items}
      isDesktop={true}
    />
  );
}
