import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  deleteMedia,
  setPrimaryMedia,
  getMediaByEntity,
  createMedia,
  updateMedia,
  uploadMedia,
} from './api';

import type { Database } from '../../types/supabase';

export type Media = Database['public']['Tables']['media']['Row'];
export type MediaInsert = Database['public']['Tables']['media']['Insert'];
export type MediaUpdate = Partial<Media>;

export function useMediaByEntityQuery(entity_type: string, entity_id: string) {
  return useQuery({
    queryKey: ['media', entity_type, entity_id],
    queryFn: () => getMediaByEntity(entity_type, entity_id),
    enabled: !!entity_type && !!entity_id,
  });
}

export function useCreateMediaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useUpdateMediaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MediaUpdate }) => updateMedia(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useDeleteMediaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useSetPrimaryMediaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      entityType,
      entityId,
      mediaId,
    }: {
      entityType: 'location' | 'treasure';
      entityId: string;
      mediaId: string;
    }) => setPrimaryMedia(entityType, entityId, mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useUploadMediaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      entityType,
      entityId,
      localUri,
      isPrimary = false,
    }: {
      userId: string;
      entityType: 'location' | 'treasure';
      entityId: string;
      localUri: string;
      isPrimary?: boolean;
    }) => uploadMedia(userId, entityType, entityId, localUri, isPrimary),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['media', variables.entityType, variables.entityId],
      });
    },
  });
}
