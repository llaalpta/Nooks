import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: theme.spacing.l, // 24dp
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
