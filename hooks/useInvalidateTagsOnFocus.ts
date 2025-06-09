import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export function useInvalidateTagsOnFocus(userId: string) {
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['tags', userId] });
      }
    }, [queryClient, userId])
  );
}
