// src/theme/tokens.ts
// Utilidades para acceder a los tokens del sistema de diseño

import { useAppTheme } from '@/contexts/ThemeContext';

/**
 * Hook para acceder a los tokens de espaciado del tema actual
 * @returns Objeto con tokens de espaciado
 */
export const useSpacing = () => {
  const theme = useAppTheme();
  return theme.spacing;
};

/**
 * Hook para acceder a los tokens de border radius del tema actual
 * @returns Objeto con tokens de border radius
 */
export const useBorderRadius = () => {
  const theme = useAppTheme();
  return theme.borderRadius;
};

/**
 * Hook para acceder a los tokens de elevación del tema actual
 * @returns Objeto con tokens de elevación
 */
export const useElevation = () => {
  const theme = useAppTheme();
  return theme.elevation;
};

/**
 * Hook para acceder a los colores del tema actual
 * @returns Objeto con tokens de color
 */
export const useColors = () => {
  const theme = useAppTheme();
  return theme.colors;
};

/**
 * Utilidad para crear estilos de elevación consistentes
 * @param level - Nivel de elevación (0-5)
 * @param theme - Tema actual
 * @returns Objeto de estilo con propiedades de sombra/elevación
 */
export const getElevationStyle = (level: keyof typeof theme.elevation, theme: any) => {
  return theme.elevation[level];
};

/**
 * Utilidad para obtener espaciado consistente
 * @param size - Tamaño del espaciado
 * @param theme - Tema actual
 * @returns Valor numérico del espaciado
 */
export const getSpacing = (size: keyof typeof theme.spacing, theme: any) => {
  return theme.spacing[size];
};

/**
 * Utilidad para obtener border radius consistente
 * @param size - Tamaño del border radius
 * @param theme - Tema actual
 * @returns Valor numérico del border radius
 */
export const getBorderRadius = (size: keyof typeof theme.borderRadius, theme: any) => {
  return theme.borderRadius[size];
};
