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
    selectContainer: {
      borderWidth: 1,
      borderRadius: 4,
      padding: 12,
      borderColor: colors.outline,
      backgroundColor: colors.surface,
    },
    selectContainerError: {
      borderColor: colors.error,
    },
    selectedText: {
      color: colors.onSurface,
      fontSize: 16,
    },
    placeholderText: {
      color: colors.onSurfaceVariant,
      fontSize: 16,
    },
    optionsContainer: {
      marginTop: 8,
      borderWidth: 1,
      borderRadius: 4,
      borderColor: colors.outline,
      backgroundColor: colors.surface,
      maxHeight: 200,
    },
    optionItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
    },
    optionText: {
      color: colors.onSurface,
      fontSize: 16,
    },
    errorText: {
      color: colors.error,
      fontSize: 12,
      marginTop: 4,
    },
    chevron: {
      position: 'absolute',
      right: 12,
      top: 14,
      color: colors.onSurfaceVariant,
    },
  });
