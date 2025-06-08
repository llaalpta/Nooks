import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.m,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.primaryContainer,
      ...theme.elevation.level1,
      borderStyle: 'solid',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.s,
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
    },
    listContainer: {
      flex: 1,
      padding: theme.spacing.m,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.l,
    },
    fab: {
      position: 'absolute',
      margin: theme.spacing.m,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.primary,
    },
  });
