import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getNooks,
  getNookById,
  createNook,
  updateNook,
  deleteNook,
  getNookPrimaryImageUrl,
} from './api';

import type { Database } from '../../types/supabase';

// Hook para obtener la URL pública de la imagen principal de un Nook
export function useNookPrimaryImageUrl(nookId: string) {
  return useQuery({
    queryKey: ['nook-primary-image', nookId],
    queryFn: () => getNookPrimaryImageUrl(nookId),
    enabled: !!nookId,
  });
}

export type Nook = Database['public']['Tables']['locations']['Row'];
export type NookInsert = Database['public']['Tables']['locations']['Insert'];
export type NookUpdate = Database['public']['Tables']['locations']['Update'];

export function useNooksQuery(realmId: string) {
  return useQuery({
    queryKey: ['nooks', realmId],
    queryFn: () => getNooks(realmId),
    enabled: !!realmId,
  });
}

export function useNookQuery(id: string) {
  return useQuery({
    queryKey: ['nook', id],
    queryFn: () => getNookById(id),
    enabled: !!id,
  });
}

export function useCreateNookMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nooks'] });
    },
  });
}

export function useUpdateNookMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NookUpdate }) => updateNook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nooks'] });
    },
  });
}

export function useDeleteNookMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nooks'] });
    },
  });
}
