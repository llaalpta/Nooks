import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    formContainer: {
      padding: 16,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.onSurface,
      marginBottom: 8,
    },
    formControl: {
      marginBottom: 16,
    },
    inputContainer: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.onSurface,
      marginBottom: 12,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.onSurface,
      marginBottom: 8,
    },
    error: {
      color: colors.error,
      fontSize: 12,
      marginTop: 4,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
    },
    button: {
      flex: 1,
      marginHorizontal: 8,
    },
    cancelButton: {
      backgroundColor: colors.surfaceVariant,
    },
    cancelButtonText: {
      color: colors.onSurfaceVariant,
    },
  });
