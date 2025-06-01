import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.m,
      backgroundColor: theme.colors.background,
    },
    title: {
      marginBottom: theme.spacing.m,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: theme.spacing.m,
    },
    buttonContainer: {
      marginBottom: theme.spacing.m,
    },
  });
