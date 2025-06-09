import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginTop: 0,
      marginBottom: theme.spacing.s,
      paddingTop: 0,
      paddingBottom: 0,
    },
    label: {
      marginBottom: theme.spacing.s,
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.onSurfaceVariant,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: theme.borderRadius.xs,
      backgroundColor: theme.colors.surface,
      flex: 1,
      height: 40,
    },
    searchContainer: {
      flexDirection: 'row',
      gap: 4,
    },
    createButton: {
      flex: 0.25,
      minWidth: 80,
      maxWidth: 120,
      height: 40,
      alignSelf: 'stretch',
      justifyContent: 'center',
      paddingVertical: 0,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: theme.spacing.s,
      marginTop: 0,
    },
    tagChip: {
      backgroundColor: theme.colors.secondaryContainer,
      borderRadius: 16,
      paddingVertical: 4,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 0,
      marginBottom: 0,
    },
    tagText: {
      color: theme.colors.onSecondaryContainer,
      marginRight: 4,
    },
    removeIcon: {
      color: theme.colors.onSecondaryContainer,
      marginLeft: 4,
    },
    suggestionContainer: {
      marginTop: theme.spacing.s,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: theme.borderRadius.xs,
      maxHeight: 200,
      marginBottom: theme.spacing.s,
    },
    suggestionItem: {
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant,
    },
    suggestionContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tagColorIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    suggestionText: {
      color: theme.colors.onSurface,
      fontSize: 16,
    },
    noSuggestions: {
      padding: theme.spacing.s,
      color: theme.colors.onSurfaceVariant,
      fontStyle: 'italic',
      textAlign: 'center',
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: 4,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.l,
      paddingVertical: theme.spacing.m,
    },

    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },

    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.spacing.m,
      width: '100%',
      maxWidth: 400,
      maxHeight: '85%',
      overflow: 'hidden',
      ...theme.elevation.level3,
    },

    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.l,
      paddingVertical: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant,
    },

    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.onSurface,
      flex: 1,
    },

    modalCloseButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.spacing.xs,
    },
  });
