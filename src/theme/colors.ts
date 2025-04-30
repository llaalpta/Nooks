// src/theme/colors.ts
const materialTheme = require('./material-theme.json');

export const Colors = {
  lightColors: {
    primary: materialTheme.schemes.light.primary,
    secondary: materialTheme.schemes.light.secondary,
    background: materialTheme.schemes.light.background,
    surface: materialTheme.schemes.light.surface,
    onSurface: materialTheme.schemes.light.onSurface,
    onSurfaceVariant: materialTheme.schemes.light.onSurfaceVariant,
    outline: materialTheme.schemes.light.outline,
    success: '#4CAF50',
    info: '#2196F3',
    warning: '#FFA000',
    error: '#B00020',
  },
  darkColors: {
    primary: materialTheme.schemes.dark.primary,
    secondary: materialTheme.schemes.dark.secondary,
    background: materialTheme.schemes.dark.background,
    surface: materialTheme.schemes.dark.surface,
    onSurface: materialTheme.schemes.dark.onSurface,
    onSurfaceVariant: materialTheme.schemes.dark.onSurfaceVariant,
    outline: materialTheme.schemes.dark.outline,
    success: '#4CAF50',
    info: '#2196F3',
    warning: '#FFA000',
    error: '#B00020',
  },
};
