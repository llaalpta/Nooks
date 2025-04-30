import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    track: {
      width: 50,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.surfaceVariant,
    },
    trackActive: {
      backgroundColor: colors.primary,
    },
    thumb: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.surface,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
    },
  });
