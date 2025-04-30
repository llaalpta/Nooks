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
    message: {
      marginBottom: 16,
      textAlign: 'center',
      color: colors.onSurfaceVariant,
    },
  });
