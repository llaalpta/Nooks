import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.m,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      overflow: 'hidden',
      ...theme.elevation.level2,
    },
    cardHorizontalContainer: {
      flexDirection: 'row',
      height: 115,
    },
    imageContainer: {
      width: 140,
      height: '100%',
      borderTopLeftRadius: theme.borderRadius.m,
      borderBottomLeftRadius: theme.borderRadius.m,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceVariant,
    },
    horizontalImage: {
      width: '100%',
      height: '100%',
    },
    horizontalPlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopLeftRadius: theme.borderRadius.m,
      borderBottomLeftRadius: theme.borderRadius.m,
    },
    cardContent: {
      flex: 1,
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.s,
      justifyContent: 'flex-start',
    },

    // TÍTULO ORIGINAL (mantener para otros usos)
    title: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 20,
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.xs,
      letterSpacing: -0.2,
    },

    // NUEVOS ESTILOS PARA TÍTULO CON CONTADOR
    titleWithCounterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    titleMain: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 20,
      color: theme.colors.onSurface,
      letterSpacing: -0.2,
      flex: 1, // Toma el espacio disponible
    },
    titleCounter: {
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 20,
      color: theme.colors.onSurfaceVariant, // Diferente color para el contador
      flexShrink: 0, // No se reduce nunca
      marginLeft: 2, // Pequeño espacio entre título y contador
    },

    description: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.s,
      fontWeight: '400',
    },
    locationInfo: {
      paddingHorizontal: theme.spacing.s,
      fontSize: 11,
      lineHeight: 16,
      color: theme.colors.onSurfaceVariant,
      fontWeight: '500',
      opacity: 0.8,
    },
    tagsContainer: {
      flexDirection: 'column',
      gap: 2,
    },
    tagLine: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    tag: {
      backgroundColor: '#FF6B6B',
      borderRadius: 12,
      paddingVertical: 3,
      paddingHorizontal: 7,
      alignSelf: 'flex-start',
      maxWidth: '100%',
    },
    tagEllipsized: {
      flex: 1,
      maxWidth: 'auto',
      minWidth: 0,
    },
    tagCounter: {
      flexShrink: 0,
      minWidth: 28,
    },
    tagText: {
      color: theme.colors.onSurface,
      fontWeight: '500',
      fontSize: 12,
      lineHeight: 14,
      letterSpacing: 0,
    },
    cardPressed: {
      transform: [{ scale: 0.98 }],
      opacity: 0.9,
    },
    locationIndicator: {
      alignItems: 'center',
      position: 'absolute',
      backgroundColor: theme.colors.surface + '80',
      borderRadius: theme.borderRadius.s,
      bottom: theme.spacing.xs,
      left: theme.spacing.xs,
      padding: 1,
    },
    statusText: {
      fontSize: 10,
      fontWeight: '600',
      color: theme.colors.onPrimaryContainer,
    },
    statusIndicator: {
      position: 'absolute',
      backgroundColor: theme.colors.surface + '80',
      borderRadius: theme.borderRadius.s,
      top: theme.spacing.xs,
      right: theme.spacing.s,
      padding: 2,
    },
    imageOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 40,
      backgroundColor: 'transparent',
    },
  });
