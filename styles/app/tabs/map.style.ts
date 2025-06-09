import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    mapContainer: {
      flex: 1,
      position: 'relative',
    },
    map: {
      flex: 1,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.l,
    },
    errorText: {
      fontSize: 16,
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.m,
    },
    calloutContainer: {
      minWidth: 200,
      padding: theme.spacing.s,
    },
    calloutTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.xs,
    },
    calloutDescription: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.xs,
    },
    calloutRadius: {
      fontSize: 12,
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    calloutAction: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    topLeftButton: {
      position: 'absolute',
      top: theme.spacing.m,
      left: theme.spacing.m,
    },
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
    bottomRightButton: {
      position: 'absolute',
      bottom: theme.spacing.m,
      right: theme.spacing.m,
    },
    bottomLeftButton: {
      position: 'absolute',
      bottom: theme.spacing.m,
      left: theme.spacing.m,
    },
    topRightButtons: {
      position: 'absolute',
      top: theme.spacing.m,
      right: theme.spacing.m,
      gap: theme.spacing.s,
    },

    bottomLeftButtons: {
      position: 'absolute',
      bottom: theme.spacing.m,
      left: theme.spacing.m,
      gap: theme.spacing.s,
    },
    selectedRealmDetails: {
      position: 'absolute',
      bottom: theme.spacing.l * 2 + 56 + theme.spacing.s + 40,
      left: theme.spacing.m,
    },
    addButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.elevation.level3,
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing.l,
      right: theme.spacing.l,
    },

    locationButtonContainer: {
      position: 'absolute',
      bottom: theme.spacing.m,
      left: theme.spacing.m,
    },
    locationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    realmsButtonContainer: {
      position: 'absolute',
      top: theme.spacing.m,
      right: theme.spacing.m,
    },
    realmsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
  });

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#263c3f',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#6b9a76',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#38414e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#212a37',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9ca5b3',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#1f2835',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#f3d19c',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2f3948',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#515c6d',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
];

export default darkMapStyle;
