import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    button: {
      borderRadius: theme.borderRadius.m,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.l,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      minHeight: 40,
    },
    contained: {
      backgroundColor: theme.colors.primary,
      ...theme.elevation.level1,
    },
    outlined: {
      borderWidth: 1,
      borderColor: theme.colors.outline,
      backgroundColor: 'transparent',
    },
    text: {
      backgroundColor: 'transparent',
    },
    disabled: {
      opacity: 0.38,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
    },
    labelContained: {
      color: theme.colors.onPrimary,
    },
    labelOutlined: {
      color: theme.colors.primary,
    },
    labelText: {
      color: theme.colors.primary,
    },
    labelDisabled: {
      color: theme.colors.onSurfaceVariant,
    },
    icon: {
      marginRight: theme.spacing.s,
    },
    loading: {
      marginRight: theme.spacing.s,
    },
  });
