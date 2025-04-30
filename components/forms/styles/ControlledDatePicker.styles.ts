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
    },
    inputContainerError: {
      borderColor: colors.error,
    },
    dateButton: {
      borderWidth: 1,
      borderRadius: 4,
      padding: 12,
      backgroundColor: colors.surface,
      borderColor: colors.outline,
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dateButtonError: {
      borderColor: colors.error,
    },
    dateText: {
      fontSize: 16,
      color: colors.onSurface,
    },
    datePlaceholder: {
      color: colors.onSurfaceVariant,
    },
    placeholderText: {
      fontSize: 16,
      color: colors.onSurfaceVariant,
    },
    errorText: {
      color: colors.error,
      fontSize: 12,
      marginTop: 4,
    },
  });
