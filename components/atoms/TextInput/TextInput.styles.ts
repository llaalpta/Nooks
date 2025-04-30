import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      marginBottom: 8,
    },
    label: {
      marginBottom: 4,
      fontSize: 14,
      fontWeight: '500',
      color: colors.onSurfaceVariant,
    },
    inputContainer: {
      borderWidth: 1,
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.outline,
    },
    inputContainerFocused: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    inputContainerError: {
      borderColor: colors.error,
    },
    input: {
      flex: 1,
      padding: 12,
      fontSize: 16,
      color: colors.onSurface,
    },
    leftIcon: {
      paddingLeft: 12,
    },
    rightIcon: {
      paddingRight: 12,
    },
    errorText: {
      color: colors.error,
      fontSize: 12,
      marginTop: 4,
    },
    helperText: {
      color: colors.onSurfaceVariant,
      fontSize: 12,
      marginTop: 4,
    },
    disabled: {
      opacity: 0.6,
    },
  });
