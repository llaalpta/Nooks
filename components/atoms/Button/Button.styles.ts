import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

// Recibimos el tema completo para acceder a todos los tokens
export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    button: {
      borderRadius: theme.borderRadius.m, // Usando token MD3 Medium (12dp)
      paddingVertical: theme.spacing.sm, // 12dp
      paddingHorizontal: theme.spacing.l, // 24dp
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      minHeight: 40, // Altura mínima según MD3
    },
    contained: {
      backgroundColor: theme.colors.primary,
      ...theme.elevation.level1, // Aplicar elevación level1
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
      opacity: 0.38, // Opacidad estándar MD3 para elementos deshabilitados
    },
    label: {
      fontSize: 14, // labelLarge según MD3
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
      marginRight: theme.spacing.s, // 8dp
    },
    loading: {
      marginRight: theme.spacing.s, // 8dp
    },
  });
