import { AppColors } from './colors';
import { AppSpacing, AppBorderRadius, AppElevation } from './spacing';
import { AppFonts } from './typography';

export interface AppTheme {
  dark: boolean;
  roundness: number;
  animation: {
    scale: number;
  };
  colors: AppColors;
  fonts: AppFonts;
  spacing: AppSpacing;
  borderRadius: AppBorderRadius;
  elevation: AppElevation;
  materialSchemes: {
    light: AppColors;
    dark: AppColors;
  };
}

export type ThemeMode = 'light' | 'dark' | 'system';
