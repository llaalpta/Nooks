import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * Hook que invalida la query de tags cuando la pantalla recibe foco (útil tras crear una etiqueta).
 * Debe usarse en formularios que usan useTagsQuery.
 */
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
