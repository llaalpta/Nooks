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
      borderBottomColor: theme.colors.outlineVariant,
      position: 'relative',
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.s,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      flex: 1,
      marginRight: theme.spacing.m,
    },
    optionsButton: {
      padding: theme.spacing.s,
      borderRadius: theme.borderRadius.xs,
    },
    optionsMenu: {
      position: 'absolute',
      top: 50,
      right: theme.spacing.m,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.s,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      ...theme.elevation.level2,
      zIndex: 1000,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.sm,
      minWidth: 140,
    },
    optionText: {
      marginLeft: theme.spacing.s,
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.onSurface,
    },
    description: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.s,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.s,
    },
    tag: {
      borderRadius: theme.borderRadius.xs,
      paddingHorizontal: theme.spacing.s,
      paddingVertical: 2,
      marginRight: theme.spacing.s,
      marginBottom: theme.spacing.xs,
    },
    tagText: {
      fontSize: 12,
      fontWeight: '500',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceVariant,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.onSurfaceVariant,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addButtonText: {
      marginLeft: theme.spacing.xs,
      color: theme.colors.primary,
      fontWeight: '500',
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
    emptyText: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      marginBottom: theme.spacing.m,
    },
    location: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginTop: theme.spacing.s,
    },
    // Estilos para los Nooks
    nookCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.s,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.m,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      ...theme.elevation.level1,
    },
    nookTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.xs,
    },
    nookDescription: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
  });
