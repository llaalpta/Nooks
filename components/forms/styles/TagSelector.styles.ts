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
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: 4,
      backgroundColor: colors.surface,
      flex: 1,
    },
    searchContainer: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 8,
    },
    createButton: {
      flex: 0,
      minWidth: 120,
    },
    textInput: {
      flex: 1,
      padding: 12,
      fontSize: 16,
      color: colors.onSurface,
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
      flexDirection: 'row',
      alignItems: 'center',
    },
    tagText: {
      color: colors.onSecondaryContainer,
      marginRight: 4,
    },
    removeIcon: {
      color: colors.onSecondaryContainer,
      marginLeft: 4,
    },
    suggestionContainer: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: 4,
      maxHeight: 200,
      marginBottom: 8,
    },
    suggestionItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
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
      color: colors.onSurface,
      fontSize: 16,
    },
    noSuggestions: {
      padding: 16,
      color: colors.onSurfaceVariant,
      fontStyle: 'italic',
      textAlign: 'center',
    },
    errorText: {
      color: colors.error,
      fontSize: 12,
      marginTop: 4,
    },
  });
