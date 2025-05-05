import { useMemo } from 'react';
import type { Domain } from './domainApi';

export const useDomainData = (domains: Domain[] | undefined, searchQuery: string, orderBy: string) => {
  return useMemo(() => {
    if (!domains) return [];
    let filtered = domains;
    
    if (searchQuery) {
      filtered = filtered.filter((domain) =>
        domain.domain.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (orderBy) {
      case "newest":
        return [...filtered].sort((a, b) => b.createdDate - a.createdDate);
      case "oldest":
        return [...filtered].sort((a, b) => a.createdDate - b.createdDate);
      case "active":
        return [...filtered].sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0));
      case "inactive":
        return [...filtered].sort((a, b) => (a.isActive ? 1 : 0) - (b.isActive ? 1 : 0));
      default:
        return filtered;
    }
  }, [domains, searchQuery, orderBy]);
}; 