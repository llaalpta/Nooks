import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    emptyText: {
      color: colors.onSurfaceVariant,
    },
    contentContainer: {
      paddingVertical: 8,
    },
    imageContainer: {
      position: 'relative',
      marginRight: 12,
    },
    image: {
      width: 96,
      height: 96,
      borderRadius: 8,
    },
    removeButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      zIndex: 10,
      backgroundColor: colors.surface,
      borderRadius: 12,
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    removeIcon: {
      fontSize: 16,
      color: colors.error,
    },
  });
