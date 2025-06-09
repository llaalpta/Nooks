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
      lineHeight: 20,
      color: theme.colors.onSurfaceVariant,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      lineHeight: 16,
      marginTop: theme.spacing.xs,
    },
  });
