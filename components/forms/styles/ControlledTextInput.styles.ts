import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.m, // 16dp
    },
    label: {
      marginBottom: theme.spacing.s, // 8dp
      fontSize: 14, // labelLarge según MD3
      fontWeight: '500',
      lineHeight: 20,
      color: theme.colors.onSurfaceVariant,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12, // bodySmall según MD3
      lineHeight: 16,
      marginTop: theme.spacing.xs, // 4dp
    },
  });
