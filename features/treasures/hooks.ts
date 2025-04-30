import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getTreasures,
  getTreasureById,
  createTreasure,
  updateTreasure,
  deleteTreasure,
} from './api';

import type { Database } from '../../types/supabase';

export type Treasure = Database['public']['Tables']['treasures']['Row'];
export type TreasureInsert = Database['public']['Tables']['treasures']['Insert'];
export type TreasureUpdate = Database['public']['Tables']['treasures']['Update'];

export function useTreasuresQuery(nookId: string) {
  return useQuery({
    queryKey: ['treasures', nookId],
    queryFn: () => getTreasures(nookId),
    enabled: !!nookId,
  });
}

export function useTreasureQuery(id: string) {
  return useQuery({
    queryKey: ['treasure', id],
    queryFn: () => getTreasureById(id),
    enabled: !!id,
  });
}

export function useCreateTreasureMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTreasure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treasures'] });
    },
  });
}

export function useUpdateTreasureMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TreasureUpdate }) => updateTreasure(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treasures'] });
    },
  });
}

export function useDeleteTreasureMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTreasure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treasures'] });
    },
  });
}
