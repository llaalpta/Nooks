import { palettes } from '@/src/theme/theme';

import { AppColors } from './colors';
import { AppSpacing } from './spacing';
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
  palettes: typeof palettes;
  materialSchemes: {
    light: AppColors;
    dark: AppColors;
  };
}

// Tipo para los modos de tema
export type ThemeMode = 'light' | 'dark' | 'system';
