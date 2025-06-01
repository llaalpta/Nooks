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
    selectContainer: {
      borderWidth: 1,
      borderRadius: theme.borderRadius.xs,
      padding: theme.spacing.sm,
      borderColor: theme.colors.outline,
      backgroundColor: theme.colors.surface,
    },
    selectContainerError: {
      borderColor: theme.colors.error,
    },
    selectedText: {
      color: theme.colors.onSurface,
      fontSize: 16,
    },
    placeholderText: {
      color: theme.colors.onSurfaceVariant,
      fontSize: 16,
    },
    optionsContainer: {
      marginTop: theme.spacing.s,
      borderWidth: 1,
      borderRadius: theme.borderRadius.xs,
      borderColor: theme.colors.outline,
      backgroundColor: theme.colors.surface,
      maxHeight: 200,
    },
    optionItem: {
      padding: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    optionText: {
      color: theme.colors.onSurface,
      fontSize: 16,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: 4,
    },
    chevron: {
      position: 'absolute',
      right: 12,
      top: 14,
      color: theme.colors.onSurfaceVariant,
    },
  });
