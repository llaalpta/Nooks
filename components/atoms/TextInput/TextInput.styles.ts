import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.s,
    },
    label: {
      marginBottom: theme.spacing.xs,
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.onSurfaceVariant,
    },
    inputContainer: {
      borderWidth: 1,
      borderRadius: theme.borderRadius.xs,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outline,
    },
    inputContainerMultiline: {
      alignItems: 'flex-start',
    },
    inputContainerFocused: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    inputContainerError: {
      borderColor: theme.colors.error,
    },
    input: {
      flex: 1,
      padding: theme.spacing.sm,
      fontSize: 16,
      color: theme.colors.onSurface,
    },
    inputMultiline: {
      minHeight: 44,
      textAlignVertical: 'top',
    },
    leftIcon: {
      paddingLeft: 12,
    },
    rightIcon: {
      paddingRight: 12,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: 4,
    },
    helperText: {
      color: theme.colors.onSurfaceVariant,
      fontSize: 12,
      marginTop: 4,
    },
    disabled: {
      opacity: 0.6,
    },
  });
