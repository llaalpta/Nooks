import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.m,
    },
    label: {
      marginBottom: theme.spacing.s,
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.onSurfaceVariant,
    },
    imagesContainer: {
      marginBottom: theme.spacing.s,
    },
    image: {
      width: 200,
      height: 200,
      marginBottom: theme.spacing.s,
      borderRadius: theme.borderRadius.s,
    },
    addButton: {
      marginTop: theme.spacing.s,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: 4,
    },
  });
