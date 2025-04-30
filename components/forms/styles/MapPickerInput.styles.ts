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
    mapContainer: {
      height: 300,
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 8,
    },
    button: {
      marginTop: 8,
    },
    coordsText: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      marginBottom: 8,
      textAlign: 'center',
    },
    errorText: {
      color: colors.error,
      fontSize: 12,
      marginTop: 4,
    },
  });
