"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True once the component is running in the browser.
 *
 * Lets a component read browser-only state (localStorage) during render rather
 * than setting state inside an effect, which costs an extra render pass and
 * makes the first paint flicker.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
