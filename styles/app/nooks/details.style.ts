import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme, insets: { top: number }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerSpacer: {
      height: insets.top + 56 + 8,
    },
    imageContainer: {
      height: 280,
      position: 'relative',
      marginTop: theme.spacing.s,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    placeholderImage: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.surfaceContainer,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      backgroundColor: theme.colors.surface,
      marginTop: -24,
      paddingTop: theme.spacing.l,
      paddingHorizontal: theme.spacing.l,
      flex: 1,
    },
    header: {
      marginBottom: theme.spacing.l,
    },
    headerTitle: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.s,
    },
    description: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 24,
    },
    location: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline + '20',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.onSurface,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primaryContainer,
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderRadius: theme.borderRadius.s,
      gap: 6,
    },
    tagsContainer: {
      marginTop: theme.spacing.m,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.s,
    },
    tag: {
      backgroundColor: theme.colors.primaryContainer,
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderRadius: theme.borderRadius.m,
    },
    tagText: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.onPrimaryContainer,
    },
    addButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.onPrimaryContainer,
    },
    treasureCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.m,
      padding: theme.spacing.l,
      marginHorizontal: theme.spacing.m,
      marginBottom: theme.spacing.m,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      ...theme.elevation.level2,
    },
    treasureTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.s,
    },
    treasureDescription: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xl,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      marginBottom: theme.spacing.l,
      lineHeight: 24,
    },
    listFooter: {
      height: 80,
    },
    treasuresSection: {
      marginTop: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.m,
      backgroundColor: theme.colors.surfaceVariant,
    },
    treasuresSectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    treasuresTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    treasuresCounter: {
      backgroundColor: theme.colors.primaryContainer,
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.spacing.l,
      minWidth: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    treasuresCounterText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.onPrimaryContainer,
    },
    treasuresTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.onSurface,
      marginRight: theme.spacing.s,
    },
  });
