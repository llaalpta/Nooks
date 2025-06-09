import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: 0,
    },
    label: {
      marginBottom: theme.spacing.s,
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.onSurfaceVariant,
    },
    mapContainer: {
      height: 320,
      borderRadius: theme.spacing.m,
      overflow: 'hidden',
      marginBottom: theme.spacing.m,
      ...theme.elevation.level2,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      position: 'relative',
    },
    topRightButton: {
      position: 'absolute',
      top: theme.spacing.s,
      right: theme.spacing.s,
      zIndex: 1000,
    },
    mapButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderRadius: theme.spacing.s,
      ...theme.elevation.level2,
    },
    mapButtonLoading: {
      backgroundColor: theme.colors.primaryContainer,
    },
    mapButtonText: {
      color: theme.colors.onPrimary,
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4,
      letterSpacing: 0.5,
    },

    radiusControlPanel: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outline,
    },
    radiusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xs,
    },
    radiusLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.onSurface,
      marginLeft: theme.spacing.xs,
    },
    sliderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xs,
    },
    slider: {
      flex: 1,
      height: 32,
      marginHorizontal: theme.spacing.s,
    },
    sliderMinLabel: {
      fontSize: 11,
      color: theme.colors.onSurfaceVariant,
      fontWeight: '500',
      minWidth: 30,
    },
    sliderMaxLabel: {
      fontSize: 11,
      color: theme.colors.onSurfaceVariant,
      fontWeight: '500',
      minWidth: 40,
      textAlign: 'right',
    },

    infoContainer: {
      backgroundColor: theme.colors.surfaceVariant,
      padding: theme.spacing.s,
      borderRadius: theme.spacing.s,
      marginBottom: theme.spacing.s,
    },
    coordsText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 16,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },

    sliderLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.s,
    },
    sliderRangeLabel: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
    },
  });
