import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      padding: theme.spacing.l,
    },
    welcomeSection: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    logo: {
      width: 120,
      height: 60,
      marginBottom: theme.spacing.m,
    },
    welcomeTitle: {
      textAlign: 'center',
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.xs,
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
      marginBottom: theme.spacing.l,
      textAlign: 'center',
      fontSize: 24,
      fontWeight: '400',
      lineHeight: 32,
      color: theme.colors.onSurface,
    },
    button: {
      marginTop: theme.spacing.m,
    },
    textButton: {
      marginTop: theme.spacing.s,
    },
  });
