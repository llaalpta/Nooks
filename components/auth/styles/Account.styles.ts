import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.m,
      backgroundColor: theme.colors.background,
    },
    section: {
      marginBottom: theme.spacing.m,
    },
    uploadingText: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
  });
