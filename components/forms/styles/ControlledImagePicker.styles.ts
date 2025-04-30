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
    imagesContainer: {
      marginBottom: 8,
    },
    image: {
      width: 200,
      height: 200,
      marginBottom: 8,
      borderRadius: 8,
    },
    addButton: {
      marginTop: 8,
    },
    errorText: {
      color: colors.error,
      fontSize: 12,
      marginTop: 4,
    },
  });
