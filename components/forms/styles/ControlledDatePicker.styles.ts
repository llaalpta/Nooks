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
      fontWeight: '500',
      color: theme.colors.onSurfaceVariant,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputContainerError: {
      borderColor: theme.colors.error,
    },
    dateButton: {
      borderWidth: 1,
      borderRadius: theme.borderRadius.xs,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outline,
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dateButtonError: {
      borderColor: theme.colors.error,
    },
    dateText: {
      fontSize: 16,
      color: theme.colors.onSurface,
    },
    datePlaceholder: {
      color: theme.colors.onSurfaceVariant,
    },
    placeholderText: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: 4,
    },
  });
