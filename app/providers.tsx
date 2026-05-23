"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const POSTHOG_KEY = "phc_xHSkr5gzwCkXusqd9zVbj2DzBiyEE6QtyhTd6MqxLyLy";

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    let url = window.origin + pathname;
    const search = searchParams.toString();
    if (search) {
      url += `?${search}`;
    }

    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(POSTHOG_KEY, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      capture_pageview: false,
      capture_pageleave: true,
      /* Scroll depth is on by default; use disable_scroll_properties to turn off. */
    });
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PostHogProvider>
  );
}
