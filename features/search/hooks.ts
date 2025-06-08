import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  searchItems,
  searchRealms,
  searchNooks,
  searchTreasures,
  getAllTreasures,
  SearchParams,
} from './api';

export function useSearchItemsQuery(
  params: SearchParams
): UseQueryResult<Awaited<ReturnType<typeof searchItems>>> {
  return useQuery({
    queryKey: ['search-items', params],
    queryFn: () => searchItems(params),
    enabled: !!params.userId,
  });
}

export function useSearchRealmsQuery(
  userId: string,
  searchText: string
): UseQueryResult<Awaited<ReturnType<typeof searchRealms>>> {
  return useQuery({
    queryKey: ['search-realms', userId, searchText],
    queryFn: () => searchRealms(userId, searchText),
    enabled: !!userId && !!searchText, // ✅ Ya está correcto
  });
}

export function useSearchNooksQuery(
  userId: string,
  searchText: string
): UseQueryResult<Awaited<ReturnType<typeof searchNooks>>> {
  return useQuery({
    queryKey: ['search-nooks', userId, searchText],
    queryFn: () => searchNooks(userId, searchText),
    enabled: !!userId && !!searchText, // ✅ Ya está correcto
  });
}

// 🔥 HOOK CORREGIDO - Solo busca cuando hay texto
export function useSearchTreasuresQuery(
  userId: string,
  searchText: string
): UseQueryResult<Awaited<ReturnType<typeof searchTreasures>>> {
  return useQuery({
    queryKey: ['search-treasures', userId, searchText],
    queryFn: () => searchTreasures(userId, searchText),
    enabled: !!userId && !!searchText, // 🔥 AGREGAR && !!searchText
  });
}

// 🔥 NUEVO HOOK - Para obtener todos los treasures
export function useAllTreasuresQuery(
  userId: string
): UseQueryResult<Awaited<ReturnType<typeof getAllTreasures>>> {
  return useQuery({
    queryKey: ['treasures', 'all', userId],
    queryFn: () => getAllTreasures(userId),
    enabled: !!userId,
  });
}
