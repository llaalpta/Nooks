import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.m,
    },
    title: {
      marginBottom: theme.spacing.s,
      fontSize: 28,
      fontWeight: 'bold',
    },
    message: {
      marginBottom: theme.spacing.l,
      textAlign: 'center',
      fontSize: 18,
    },
  });
