import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.m,
    },
    label: {
      marginBottom: theme.spacing.s,
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.onSurfaceVariant,
    },
    mapContainer: {
      height: 300,
      borderRadius: theme.borderRadius.s,
      overflow: 'hidden',
      marginBottom: theme.spacing.s,
      position: 'relative',
    },
    locationButtonContainer: {
      position: 'absolute',
      top: 16,
      right: 16,
      zIndex: 1,
    },
    locationButton: {
      backgroundColor: theme.colors.surface,
      elevation: 4,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    button: {
      marginTop: theme.spacing.s,
    },
    coordsText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.s,
      textAlign: 'center',
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: 4,
    },
    sliderContainer: {
      marginBottom: theme.spacing.m,
      paddingHorizontal: 4,
    },
    sliderLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.s,
      textAlign: 'center',
    },
    slider: {
      width: '100%',
      height: 40,
      marginBottom: theme.spacing.xs,
    },
    sliderLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
    },
    sliderRangeLabel: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
    },
    circularSliderContainer: {
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.m,
    },
    circularSlider: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circularSliderTrack: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: 150,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    circularSliderThumb: {
      width: 24,
      height: 24,
      borderRadius: theme.borderRadius.m,
      backgroundColor: theme.colors.primary,
      borderWidth: 2,
      borderColor: theme.colors.surface,
      elevation: 2,
    },
    circularSliderLabel: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -50 }, { translateY: -50 }],
    },

    // Estilos para el botón de ubicación
    topRightButton: {
      position: 'absolute',
      top: theme.spacing.m,
      right: theme.spacing.m,
    },
    mapButton: {
      backgroundColor: theme.colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderRadius: theme.borderRadius.m,
      gap: theme.spacing.xs,
      ...theme.elevation.level2,
    },
    mapButtonLoading: {
      opacity: 0.8,
    },
    mapButtonText: {
      color: theme.colors.onPrimary,
      fontSize: 12,
      fontWeight: '500',
    },
  });
