import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      marginBottom: 8,
      fontSize: 14,
      fontWeight: '500',
      color: colors.onSurfaceVariant,
    },
    inputContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 8,
    },
    searchContainer: {
      marginBottom: 8,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 8,
    },
    tagChip: {
      backgroundColor: colors.secondaryContainer,
      borderRadius: 16,
      paddingVertical: 6,
      paddingHorizontal: 12,
      marginRight: 8,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    tagText: {
      color: colors.onSecondaryContainer,
      marginRight: 4,
    },
    suggestionContainer: {
      padding: 8,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: 4,
      maxHeight: 200,
      marginBottom: 8,
    },
    suggestionItem: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    suggestionItemLast: {
      borderBottomWidth: 0,
    },
    suggestionText: {
      color: colors.onSurface,
    },
    noSuggestions: {
      padding: 8,
      color: colors.onSurfaceVariant,
      fontStyle: 'italic',
    },
    errorText: {
      color: colors.error,
      fontSize: 12,
      marginTop: 4,
    },
    removeIcon: {
      color: colors.onSecondaryContainer,
      marginLeft: 4,
    },
    loadingContainer: {
      padding: 8,
      alignItems: 'center',
    },
  });
