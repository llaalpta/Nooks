import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 32,
    },
    image: {
      width: 120,
      height: 120,
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 8,
      color: colors.primary,
    },
    subtitle: {
      fontSize: 16,
      color: colors.onSurfaceVariant,
    },
  });
