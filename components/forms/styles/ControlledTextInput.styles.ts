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
    errorText: {
      color: colors.error,
      fontSize: 12,
      marginTop: 4,
    },
  });
