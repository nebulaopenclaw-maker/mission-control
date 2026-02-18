'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';

let convexClient: ConvexReactClient | null = null;

function getConvexClient(): ConvexReactClient | null {
  if (typeof window === 'undefined') return null;
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  if (!convexClient) {
    convexClient = new ConvexReactClient(url);
  }
  return convexClient;
}

export function Providers({ children }: { children: ReactNode }) {
  const client = getConvexClient();

  if (client) {
    return <ConvexProvider client={client}>{children}</ConvexProvider>;
  }

  // Convex not configured — render without it
  return <>{children}</>;
}
