"use client";

import { useCallback, useEffect, useState } from "react";

/** `false` in production builds — layout edit UI and handlers are inert. */
export const ABOUT_LAYOUT_EDIT_DEV = process.env.NODE_ENV === "development";

function readEditQuery(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("edit") === "true";
}

/**
 * Dev-only layout edit mode: `?edit=true` in the URL + development build.
 * Optional `E` toggles the draggable UI on/off while the query param stays.
 */
export function useAboutBoardLayoutEdit() {
  const [hasEditQuery, setHasEditQuery] = useState(false);
  const [uiEnabled, setUiEnabled] = useState(true);

  useEffect(() => {
    const sync = () => {
      const next = readEditQuery();
      setHasEditQuery(next);
      if (!next) setUiEnabled(true);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const editModeActive = ABOUT_LAYOUT_EDIT_DEV && hasEditQuery && uiEnabled;

  const toggleUiWithE = useCallback(() => {
    if (!ABOUT_LAYOUT_EDIT_DEV || !hasEditQuery) return;
    setUiEnabled((v) => !v);
  }, [hasEditQuery]);

  return { editModeActive, toggleUiWithE, hasEditQuery };
}
