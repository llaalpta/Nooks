import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  addTagToLocation,
  removeTagFromLocation,
  addTagToTreasure,
  removeTagFromTreasure,
} from './api';

import type { Database } from '../../types/supabase';

export type Tag = Database['public']['Tables']['tags']['Row'];
export type TagInsert = Database['public']['Tables']['tags']['Insert'];
export type TagUpdate = Database['public']['Tables']['tags']['Update'];

export function useTagsQuery(userId: string) {
  return useQuery({
    queryKey: ['tags', userId],
    queryFn: () => getTags(userId),
    enabled: !!userId,
  });
}

export function useTagQuery(id: string) {
  return useQuery({
    queryKey: ['tag', id],
    queryFn: () => getTagById(id),
    enabled: !!id,
  });
}

export function useCreateTagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useUpdateTagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TagUpdate }) => updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useDeleteTagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

// Asociaciones de tags
export function useAddTagToLocationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ location_id, tag_id }: { location_id: string; tag_id: string }) =>
      addTagToLocation(location_id, tag_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useRemoveTagFromLocationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ location_id, tag_id }: { location_id: string; tag_id: string }) =>
      removeTagFromLocation(location_id, tag_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useAddTagToTreasureMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ treasure_id, tag_id }: { treasure_id: string; tag_id: string }) =>
      addTagToTreasure(treasure_id, tag_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useRemoveTagFromTreasureMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ treasure_id, tag_id }: { treasure_id: string; tag_id: string }) =>
      removeTagFromTreasure(treasure_id, tag_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
