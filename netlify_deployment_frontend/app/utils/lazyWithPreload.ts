import React from "react";

export function lazyWithPreload(factory: () => Promise<{ default: React.ComponentType<any> }>) {
  const Component = React.lazy(factory);
  (Component as any).preload = factory;
  return Component as React.LazyExoticComponent<any> & { preload: () => void };
}
