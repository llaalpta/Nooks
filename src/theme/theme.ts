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
  roundness: 12, // Actualizado a MD3 Medium
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
  // Sistema de espaciado mejorado siguiendo MD3
  spacing: {
    xs: 4,
    s: 8,
    sm: 12,
    m: 16,
    ml: 20,
    l: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  } as AppSpacing,
  // Sistema de border radius según MD3
  borderRadius: {
    xs: 4, // Extra Small
    s: 8, // Small
    m: 12, // Medium
    l: 16, // Large
    xl: 24, // Extra Large
    xxl: 32, // Extra Extra Large
    xxxl: 40, // Extra Extra Extra Large
    round: 50, // Completamente redondeado
  },
  // Sistema de elevación MD3
  elevation: {
    level0: {
      elevation: 0,
      shadowOpacity: 0,
    },
    level1: {
      elevation: 1,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 1,
    },
    level2: {
      elevation: 3,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
    },
    level3: {
      elevation: 6,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
    },
    level4: {
      elevation: 8,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.16,
      shadowRadius: 8,
    },
    level5: {
      elevation: 12,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
  },
};

// Exportar paletas completas del Material Theme Builder

// Tema claro
export const lightTheme: AppTheme = {
  ...defaultThemeSettings,
  dark: false,
  colors: {
    ...(materialTheme.schemes.light as Partial<AppColors>),
    ...customColors,
  } as AppColors,
  // palettes: materialTheme.palettes, // Eliminado: no existe en materialTheme
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
  // palettes: materialTheme.palettes, // Eliminado: no existe en materialTheme
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
  // palettes: materialTheme.palettes, // Eliminado: no existe en materialTheme
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
