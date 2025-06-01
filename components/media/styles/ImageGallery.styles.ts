import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.m,
    },
    emptyText: {
      color: theme.colors.onSurfaceVariant,
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
      borderRadius: theme.borderRadius.s,
    },
    removeButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      zIndex: 10,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.m,
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
      color: theme.colors.error,
    },
  });
