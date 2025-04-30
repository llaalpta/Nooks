import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      padding: 32,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: colors.error,
    },
    message: {
      marginBottom: 24,
      textAlign: 'center',
      color: colors.onSurfaceVariant,
    },
    button: {
      marginTop: 8,
      minWidth: 120,
    },
  });
