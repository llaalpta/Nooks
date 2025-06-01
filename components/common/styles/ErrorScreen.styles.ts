import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
      padding: theme.spacing.xl,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: theme.spacing.m,
      color: theme.colors.error,
    },
    message: {
      marginBottom: theme.spacing.l,
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
    },
    button: {
      marginTop: theme.spacing.s,
      minWidth: 120,
    },
  });
