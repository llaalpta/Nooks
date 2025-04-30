import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      marginTop: 8,
      color: colors.onSurfaceVariant,
    },
  });
