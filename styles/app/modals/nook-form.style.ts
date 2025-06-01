import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    formContainer: {
      padding: theme.spacing.m,
    },
    header: {
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.m,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.s,
    },
    realmInfo: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      marginTop: theme.spacing.xs,
    },
    formControl: {
      marginBottom: theme.spacing.m,
    },
    inputContainer: {
      marginBottom: theme.spacing.m,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.s,
    },
    error: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: theme.spacing.xs,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.l,
    },
    button: {
      flex: 1,
      marginHorizontal: theme.spacing.s,
    },
    cancelButton: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    cancelButtonText: {
      color: theme.colors.onSurfaceVariant,
    },
  });
