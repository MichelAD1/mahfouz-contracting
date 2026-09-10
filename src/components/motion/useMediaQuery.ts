"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query as an external store, which is what it is — no
 * effect, no cascading render, and a defined server snapshot.
 *
 * The server snapshot is `false`, so this can only ever be used to *enable* an
 * enhancement such as parallax, never to pick a layout. Layout belongs in CSS.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onStoreChange);
      return () => list.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
