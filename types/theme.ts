import { AppColors } from './colors';
import { AppSpacing, AppBorderRadius, AppElevation } from './spacing';
import { AppFonts } from './typography';

// Tipo para el tema completo
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

// Tipo para los modos de tema
export type ThemeMode = 'light' | 'dark' | 'system';
