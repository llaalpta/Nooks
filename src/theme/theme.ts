// src/theme/theme.ts

import { AppTheme, AppFonts, AppSpacing, AppColors } from '@/types';

import materialTheme from './material-theme.json';

// Definir colores personalizados adicionales
const customColors = {
  success: '#4CAF50',
  info: '#2196F3',
  warning: '#FFA000',
  default: '#9E9E9E',
};

// Configuración de radios, sombras y tipografía independiente de React Native Paper
const defaultThemeSettings: Omit<AppTheme, 'colors' | 'palettes' | 'materialSchemes'> = {
  roundness: 4,
  animation: {
    scale: 1.0,
  },
  dark: false,
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  } as AppFonts,
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  } as AppSpacing,
};

// Exportar paletas completas del Material Theme Builder
export const palettes = materialTheme.palettes;

// Tema claro
export const lightTheme: AppTheme = {
  ...defaultThemeSettings,
  dark: false,
  colors: {
    ...(materialTheme.schemes.light as Partial<AppColors>),
    ...customColors,
  } as AppColors,
  palettes: materialTheme.palettes,
  materialSchemes: {
    light: {
      ...(materialTheme.schemes.light as Partial<AppColors>),
      ...customColors,
    } as AppColors,
    dark: {
      ...(materialTheme.schemes.dark as Partial<AppColors>),
      ...customColors,
    } as AppColors,
  },
};

// Tema oscuro
export const darkTheme: AppTheme = {
  ...defaultThemeSettings,
  dark: true,
  colors: {
    ...(materialTheme.schemes.dark as Partial<AppColors>),
    ...customColors,
  } as AppColors,
  palettes: materialTheme.palettes,
  materialSchemes: {
    light: {
      ...(materialTheme.schemes.light as Partial<AppColors>),
      ...customColors,
    } as AppColors,
    dark: {
      ...(materialTheme.schemes.dark as Partial<AppColors>),
      ...customColors,
    } as AppColors,
  },
};

// Función auxiliar para seleccionar el tema según el esquema de colores
export const getThemeByScheme = (colorScheme: string | null | undefined): AppTheme => {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};

export default {
  light: lightTheme,
  dark: darkTheme,
  palettes: materialTheme.palettes,
  // Aquí solo exportamos light y dark según lo definido en la interfaz
  materialSchemes: {
    light: {
      ...(materialTheme.schemes.light as Partial<AppColors>),
      ...customColors,
    } as AppColors,
    dark: {
      ...(materialTheme.schemes.dark as Partial<AppColors>),
      ...customColors,
    } as AppColors,
  },
};
