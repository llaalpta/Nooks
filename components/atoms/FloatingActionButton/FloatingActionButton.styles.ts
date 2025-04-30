import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    button: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 6,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
    },
  });
