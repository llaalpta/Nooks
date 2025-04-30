import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';
import { TextStyles } from '@/types/typography';

export const createStyles = (colors: AppColors): TextStyles => {
  const styles = StyleSheet.create({
    base: {
      color: colors.onSurface,
    },
    bodySmall: {
      fontSize: 12,
      lineHeight: 16,
    },
    bodyMedium: {
      fontSize: 14,
      lineHeight: 20,
    },
    bodyLarge: {
      fontSize: 16,
      lineHeight: 24,
    },
    labelSmall: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '500',
      letterSpacing: 0.5,
    },
    labelMedium: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500',
      letterSpacing: 0.5,
    },
    labelLarge: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
      letterSpacing: 0.1,
    },
    titleSmall: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
      letterSpacing: 0.1,
    },
    titleMedium: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
      letterSpacing: 0.15,
    },
    titleLarge: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '500',
    },
    headlineSmall: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '500',
    },
    headlineMedium: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '500',
    },
    headlineLarge: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '500',
    },
    displaySmall: {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '500',
    },
    displayMedium: {
      fontSize: 45,
      lineHeight: 52,
      fontWeight: '500',
    },
    displayLarge: {
      fontSize: 57,
      lineHeight: 64,
      fontWeight: '500',
    },
    // Alineación de texto
    textCenter: {
      textAlign: 'center',
    },
    textLeft: {
      textAlign: 'left',
    },
    textRight: {
      textAlign: 'right',
    },
    // Espaciado
    mb1: {
      marginBottom: 4,
    },
    mb2: {
      marginBottom: 8,
    },
    mb3: {
      marginBottom: 12,
    },
    mb4: {
      marginBottom: 16,
    },
    mb5: {
      marginBottom: 20,
    },
  });

  return styles as unknown as TextStyles;
};
