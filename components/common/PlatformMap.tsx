import React from 'react';
import { Platform, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

// Platform-specific map components
interface MapComponentProps {
  style?: any;
  children?: React.ReactNode;
  [key: string]: any;
}

interface WebMapPlaceholderProps {
  style?: any;
  children?: React.ReactNode;
}

const WebMapPlaceholder: React.FC<WebMapPlaceholderProps> = ({ style, children }) => {
  const theme = useAppTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surfaceVariant,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          padding: 16,
        },
        style,
      ]}
    >
      <Text style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
        Mapa no disponible en web.{'\n'}
        Por favor, usa la aplicación móvil para ver el mapa.
      </Text>
      {children}
    </View>
  );
};

// Generic fallback component for non-web platforms when maps are not available
const GenericMapComponent: React.FC<MapComponentProps> = ({ style, children, ...props }) => (
  <View style={style} {...props}>
    {children}
  </View>
);

// Dynamic import function for react-native-maps
const getMapComponents = () => {
  if (Platform.OS === 'web') {
    return {
      MapView: WebMapPlaceholder,
      Marker: View,
      Circle: View,
      Callout: View,
    };
  }
  try {
    // Dynamic require for non-web platforms
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const RNMaps = require('react-native-maps');
    return {
      MapView: RNMaps.default || RNMaps.MapView,
      Marker: RNMaps.Marker,
      Circle: RNMaps.Circle,
      Callout: RNMaps.Callout,
    };
  } catch {
    // Fallback if react-native-maps is not available
    return {
      MapView: GenericMapComponent,
      Marker: GenericMapComponent,
      Circle: GenericMapComponent,
      Callout: GenericMapComponent,
    };
  }
};

// Get platform-specific components
const { MapView, Marker, Circle, Callout } = getMapComponents();

// Export platform-specific components
export const PlatformMapView = MapView;
export const PlatformMarker = Marker;
export const PlatformCircle = Circle;
export const PlatformCallout = Callout;

// Export types conditionally
export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}
