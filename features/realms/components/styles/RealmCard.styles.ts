import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    cardContent: {
      padding: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.onSurface,
      marginBottom: 4,
    },
    description: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
      marginBottom: 8,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    tag: {
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginRight: 8,
      marginBottom: 4,
    },
    tagText: {
      fontSize: 12,
      fontWeight: '500',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: 8,
    },
  });
