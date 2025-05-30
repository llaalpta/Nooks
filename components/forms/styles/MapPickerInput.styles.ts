import { StyleSheet } from 'react-native';

import { AppColors } from '@/types/colors';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      marginBottom: 8,
      fontSize: 14,
      fontWeight: '500',
      color: colors.onSurfaceVariant,
    },
    mapContainer: {
      height: 300,
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 8,
      position: 'relative',
    },
    locationButtonContainer: {
      position: 'absolute',
      top: 16,
      right: 16,
      zIndex: 1,
    },
    locationButton: {
      backgroundColor: colors.surface,
      elevation: 4,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    button: {
      marginTop: 8,
    },
    coordsText: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      marginBottom: 8,
      textAlign: 'center',
    },
    errorText: {
      color: colors.error,
      fontSize: 12,
      marginTop: 4,
    },
    sliderContainer: {
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    sliderLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.onSurfaceVariant,
      marginBottom: 8,
      textAlign: 'center',
    },
    slider: {
      width: '100%',
      height: 40,
      marginBottom: 4,
    },
    sliderLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
    },
    sliderRangeLabel: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
    },
    circularSliderContainer: {
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
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
      borderColor: colors.primary,
    },
    circularSliderThumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.surface,
      elevation: 2,
    },
    circularSliderLabel: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -50 }, { translateY: -50 }],
    },
  });
