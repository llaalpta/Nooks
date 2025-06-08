import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';

import {
  getRealms,
  createRealm,
  updateRealm,
  deleteRealm,
  hasNooks,
  hasTreasures,
  getNearbyRealms,
  getRealmPrimaryImageUrl,
  getRealmWithTags,
} from './api';

import type { Database } from '../../types/supabase';

// Tipos para los datos de Realm
export type Realm = Database['public']['Tables']['locations']['Row'];
export type RealmInsert = Database['public']['Tables']['locations']['Insert'];
export type RealmUpdate = Database['public']['Tables']['locations']['Update'];

export function useRealmsQuery(userId: string) {
  return useQuery({
    queryKey: ['realms', userId],
    queryFn: () => getRealms(userId),
    enabled: !!userId,
  });
}

export function useRealmQuery(id: string) {
  return useQuery({
    queryKey: ['realm', id],
    queryFn: () => getRealmWithTags(id),
    enabled: !!id,
  });
}

export function useCreateRealmMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRealm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['realms'] });
    },
  });
}

export function useUpdateRealmMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RealmUpdate }) => updateRealm(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['realms'] });
    },
  });
}

export function useDeleteRealmMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRealm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['realms'] });
    },
  });
}

export function useHasNooks(realmId: string) {
  return useQuery({
    queryKey: ['realm-has-nooks', realmId],
    queryFn: () => hasNooks(realmId),
    enabled: !!realmId,
  });
}

export function useHasTreasures(nookId: string) {
  return useQuery({
    queryKey: ['nook-has-treasures', nookId],
    queryFn: () => hasTreasures(nookId),
    enabled: !!nookId,
  });
}

export function useNearbyRealms(
  userId: string,
  latitude: number,
  longitude: number,
  radius: number
): UseQueryResult<{
  data: Database['public']['Tables']['locations']['Row'][] | null;
  error: unknown;
}> {
  return useQuery({
    queryKey: ['realms-nearby', userId, latitude, longitude, radius],
    queryFn: () => getNearbyRealms(userId, latitude, longitude, radius),
    enabled: !!userId && latitude != null && longitude != null && radius != null,
  });
}

export function useRealmPrimaryImageUrl(realmId: string) {
  return useQuery({
    queryKey: ['realm-primary-image', realmId],
    queryFn: () => getRealmPrimaryImageUrl(realmId),
    enabled: !!realmId,
  });
}
