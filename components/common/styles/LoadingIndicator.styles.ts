import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing.m,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      marginTop: theme.spacing.s,
      color: theme.colors.onSurfaceVariant,
    },
  });
