import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';
import { TextStyles } from '@/types/typography';

export const createStyles = (theme: AppTheme): TextStyles => {
  const styles = StyleSheet.create({
    base: {
      color: theme.colors.onSurface,
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
    textCenter: {
      textAlign: 'center',
    },
    textLeft: {
      textAlign: 'left',
    },
    textRight: {
      textAlign: 'right',
    },
    mb1: {
      marginBottom: theme.spacing.xs,
    },
    mb2: {
      marginBottom: theme.spacing.s,
    },
    mb3: {
      marginBottom: 12,
    },
    mb4: {
      marginBottom: theme.spacing.m,
    },
    mb5: {
      marginBottom: 20,
    },
  });

  return styles as unknown as TextStyles;
};
