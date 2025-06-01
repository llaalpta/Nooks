import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      ...theme.elevation.level1,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.sm,
      minHeight: 62,
    },
    titleContainer: {
      flex: 1,
      paddingVertical: theme.spacing.xs,
    },
    title: {
      fontSize: 26,
      fontWeight: '800',
      color: theme.colors.primary,
      letterSpacing: -0.8,
      textTransform: 'uppercase',
      textShadowColor: 'rgba(0, 0, 0, 0.15)',
      textShadowOffset: { width: 0.5, height: 1 },
      textShadowRadius: 2,
      lineHeight: 32,
    },
    profileButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.s,
    },
  });
