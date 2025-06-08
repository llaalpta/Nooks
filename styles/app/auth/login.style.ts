import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      padding: theme.spacing.l, // 24dp
    },
    welcomeSection: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl, // 32dp
    },
    logo: {
      width: 120,
      height: 60,
      marginBottom: theme.spacing.m, // 16dp
    },
    welcomeTitle: {
      textAlign: 'center',
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.xs, // 4dp
    },
    brandTitle: {
      textAlign: 'center',
      color: theme.colors.primary,
      fontWeight: '600',
    },
    formSection: {
      width: '100%',
    },
    title: {
      marginBottom: theme.spacing.l, // 24dp
      textAlign: 'center',
      fontSize: 24, // headlineSmall según MD3
      fontWeight: '400',
      lineHeight: 32,
      color: theme.colors.onSurface,
    },
    button: {
      marginTop: theme.spacing.m, // 16dp
    },
    textButton: {
      marginTop: theme.spacing.s, // 8dp
    },
  });
