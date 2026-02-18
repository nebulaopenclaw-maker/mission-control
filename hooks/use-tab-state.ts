'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useTabState(paramKey = 'tab', defaultTab = '') {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get(paramKey) ?? defaultTab;

  const setTab = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(paramKey, id);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams, paramKey]
  );

  return { activeTab, setTab };
}
