import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    formContainer: {
      padding: theme.spacing.m, // 16dp
    },
    header: {
      paddingHorizontal: theme.spacing.m, // 16dp
      paddingVertical: theme.spacing.m, // 16dp
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant,
      ...theme.elevation.level1, // Elevación sutil
    },
    headerTitle: {
      fontSize: 24, // headlineSmall según MD3
      fontWeight: '400',
      lineHeight: 32,
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.s, // 8dp
    },
    formControl: {
      marginBottom: theme.spacing.xs, // 4dp
    },
    inputContainer: {
      marginBottom: theme.spacing.m, // 16dp
    },
    sectionTitle: {
      fontSize: 18, // titleMedium+ según jerarquía
      fontWeight: '500',
      lineHeight: 24,
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.sm, // 12dp
    },
    label: {
      fontSize: 16, // bodyLarge según MD3
      fontWeight: '500',
      lineHeight: 24,
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.s, // 8dp
    },
    error: {
      color: theme.colors.error,
      fontSize: 12, // bodySmall según MD3
      lineHeight: 16,
      marginTop: theme.spacing.xs, // 4dp
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.l, // 24dp
    },
    button: {
      flex: 1,
      marginHorizontal: theme.spacing.s, // 8dp
    },
    cancelButton: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    cancelButtonText: {
      color: theme.colors.onSurfaceVariant,
    },
  });
