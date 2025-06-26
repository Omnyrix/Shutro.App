import React from "react";

export function lazyWithPreload<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> & { preload: () => void } {
  let loaded: Promise<{ default: T }> | null = null;

  const preload = () => {
    if (!loaded) {
      loaded = factory(); // Trigger the dynamic import
    }
    return loaded;
  };

  const Component = React.lazy(() => {
    return loaded ?? factory(); // Use cached import if available
  });

  (Component as typeof Component & { preload: () => void }).preload = preload;

  return Component as typeof Component & { preload: () => void };
}
