"use client";

import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import type { OverlayScrollbarsComponentRef } from "overlayscrollbars-react";
import { useCallback, useRef } from "react";
import type { ReactNode } from "react";

type ScrollableProps = {
  children: ReactNode;
  x?: boolean;
  y?: boolean;
  className?: string;
  defer?: boolean;

  /**
   * Keeps the scroll at the edge when new content is added,
   * but only if the user was already close to that edge.
   */
  stickToEdge?: boolean;

  /**
   * Pixel tolerance for detecting whether the scroll is at the edge.
   */
  edgeThreshold?: number;
};

export function Scrollable({
  children,
  x = false,
  y = false,
  className = "h-screen w-screen",
  defer = false,
  stickToEdge = false,
  edgeThreshold = 20,
}: ScrollableProps) {
  const osRef = useRef<OverlayScrollbarsComponentRef<"div"> | null>(null);

  const wasAtXEdgeRef = useRef(true);
  const wasAtYEdgeRef = useRef(true);

  const getViewport = useCallback(() => {
    return osRef.current?.osInstance()?.elements().viewport ?? null;
  }, []);

  const scrollToEdge = useCallback(() => {
    const viewport = getViewport();
    if (!viewport) return;

    if (x) {
      viewport.scrollLeft = viewport.scrollWidth;
    }

    if (y) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [getViewport, x, y]);

  const updateEdgeState = useCallback(() => {
    const viewport = getViewport();
    if (!viewport) return;

    if (x) {
      const distanceFromRight =
        viewport.scrollWidth - viewport.scrollLeft - viewport.clientWidth;

      wasAtXEdgeRef.current = distanceFromRight <= edgeThreshold;
    }

    if (y) {
      const distanceFromBottom =
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;

      wasAtYEdgeRef.current = distanceFromBottom <= edgeThreshold;
    }
  }, [getViewport, x, y, edgeThreshold]);

  const handleInitialized = useCallback(() => {
    if (!stickToEdge) return;

    requestAnimationFrame(() => {
      scrollToEdge();
      updateEdgeState();
    });
  }, [stickToEdge, scrollToEdge, updateEdgeState]);

  const handleScroll = useCallback(() => {
    if (!stickToEdge) return;

    updateEdgeState();
  }, [stickToEdge, updateEdgeState]);

  const handleUpdated = useCallback(() => {
    if (!stickToEdge) return;

    const shouldScrollX = x && wasAtXEdgeRef.current;
    const shouldScrollY = y && wasAtYEdgeRef.current;

    if (!shouldScrollX && !shouldScrollY) return;

    requestAnimationFrame(() => {
      const viewport = getViewport();
      if (!viewport) return;

      if (shouldScrollX) {
        viewport.scrollLeft = viewport.scrollWidth;
      }

      if (shouldScrollY) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    });
  }, [stickToEdge, getViewport, x, y]);

  return (
    <OverlayScrollbarsComponent
      ref={osRef}
      defer={stickToEdge ? true : defer}
      className={className}
      options={{
        overflow: {
          x: x ? "scroll" : "hidden",
          y: y ? "scroll" : "hidden",
        },
        scrollbars: {
          autoHide: "scroll",
          autoHideDelay: 300,
          theme: "os-theme-light",
        },
      }}
      events={{
        initialized: handleInitialized,
        scroll: handleScroll,
        updated: handleUpdated,
      }}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}