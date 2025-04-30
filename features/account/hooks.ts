import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getProfile, updateProfile, uploadAvatar } from './api';

export function useProfileQuery(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId),
    enabled: !!userId,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      updates,
    }: {
      userId: string;
      updates: { username: string; avatar_url: string };
    }) => updateProfile(userId, updates),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
    },
  });
}

export function useUploadAvatarMutation() {
  return useMutation({
    mutationFn: ({ userId, localUri }: { userId: string; localUri: string }) =>
      uploadAvatar(userId, localUri),
  });
}
