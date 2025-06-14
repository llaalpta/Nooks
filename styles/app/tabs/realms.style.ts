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
      paddingVertical: theme.spacing.s,
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
      lineHeight: 32,
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 22,
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
    searchContainer: {
      marginTop: theme.spacing.m,
      paddingHorizontal: theme.spacing.m,
      marginBottom: theme.spacing.s,
    },

    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.s,
    },

    searchInput: {
      flex: 1,
      marginBottom: 0,
    },

    clearButton: {
      padding: theme.spacing.xs,
    },

    filterButton: {
      width: 48,
      height: 48,
      borderRadius: theme.spacing.s,
      backgroundColor: theme.colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },

    filterButtonActive: {
      backgroundColor: theme.colors.primary,
    },

    filterBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: theme.colors.error,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },

    filterBadgeText: {
      color: theme.colors.onError,
      fontSize: 12,
      fontWeight: '600',
    },

    tagFiltersContainer: {
      marginTop: theme.spacing.m,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.spacing.s,
      padding: theme.spacing.m,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },

    tagFiltersTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.s,
    },

    tagFiltersGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.s,
    },

    tagFilterChip: {
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderRadius: theme.spacing.l,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },

    tagFilterChipSelected: {
      borderColor: 'transparent',
    },

    tagFilterText: {
      fontSize: 12,
      fontWeight: '500',
    },

    resultsIndicator: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.s,
      paddingVertical: theme.spacing.s,
    },

    resultsText: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },

    clearFiltersText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '500',
    },
  });
