import React, { useState, useEffect } from 'react';
import { Platform, View } from 'react-native';

import { Button } from '@/components/atoms/Button';
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

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  errorDetails: string;
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
        🌐 Mapa no disponible en web.{'\n'}
        Por favor, usa la aplicación móvil para ver el mapa.
      </Text>
      {children}
    </View>
  );
};

// Enhanced error fallback component
const MapErrorComponent: React.FC<{
  error: ErrorBoundaryState;
  onRetry: () => void;
  style?: any;
  children?: React.ReactNode;
}> = ({ error, onRetry, style, children }) => {
  const theme = useAppTheme();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.errorContainer,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          padding: 20,
          minHeight: 200,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: theme.colors.onErrorContainer,
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 12,
        }}
      >
        Error en Google Maps
      </Text>

      <Text
        style={{
          color: theme.colors.onErrorContainer,
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        {error.errorMessage}
      </Text>

      <View style={{ gap: 8, alignItems: 'center' }}>
        <Button
          mode="contained"
          onPress={onRetry}
          style={{ backgroundColor: theme.colors.primary }}
        >
          Reintentar
        </Button>

        <Button
          mode="outlined"
          onPress={() => setShowDetails(!showDetails)}
          style={{ borderColor: theme.colors.onErrorContainer }}
        >
          {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
        </Button>
      </View>

      {showDetails && (
        <View
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: theme.colors.surface,
            borderRadius: 8,
            width: '100%',
          }}
        >
          <Text
            style={{
              color: theme.colors.onSurface,
              fontSize: 12,
              fontFamily: 'monospace',
            }}
          >
            {error.errorDetails}
          </Text>
        </View>
      )}

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

// Enhanced dynamic import function with better error handling
const getMapComponents = (onError: (error: ErrorBoundaryState) => void) => {
  if (Platform.OS === 'web') {
    return {
      MapView: WebMapPlaceholder,
      Marker: View,
      Circle: View,
      Callout: View,
      success: true,
    };
  }

  try {
    // Dynamic require for non-web platforms
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const RNMaps = require('react-native-maps');

    // Verificaciones detalladas
    if (!RNMaps) {
      throw new Error('react-native-maps module not found');
    }

    const MapView = RNMaps.default || RNMaps.MapView;
    if (!MapView) {
      throw new Error('MapView component not found in react-native-maps');
    }

    if (!RNMaps.Marker) {
      throw new Error('Marker component not found in react-native-maps');
    }

    // Log de éxito para debugging
    // eslint-disable-next-line no-console
    console.log('react-native-maps loaded successfully');

    return {
      MapView: MapView,
      Marker: RNMaps.Marker,
      Circle: RNMaps.Circle,
      Callout: RNMaps.Callout,
      success: true,
    };
  } catch (error) {
    // Error detallado para debugging
    // eslint-disable-next-line no-console
    console.error('Error loading react-native-maps:', error);

    let errorMessage = 'Error desconocido cargando Google Maps';
    let errorDetails = String(error);

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        errorMessage = 'react-native-maps no está instalado correctamente';
        errorDetails = `Módulo no encontrado: ${error.message}\n\nSolución:\n1. Verificar instalación\n2. Hacer rebuild nativo\n3. Verificar API Key de Google Maps`;
      } else if (error.message.includes('MapView')) {
        errorMessage = 'Componente MapView no disponible';
        errorDetails = `Error de componente: ${error.message}\n\nPosibles causas:\n1. API Key incorrecta\n2. Permisos faltantes\n3. Build nativo requerido`;
      } else {
        errorMessage = 'Error de configuración de mapas';
        errorDetails = `Error: ${error.message}\n\nStack: ${error.stack || 'No disponible'}`;
      }
    }

    // Notificar error al componente padre
    onError({
      hasError: true,
      errorMessage,
      errorDetails,
    });

    return {
      MapView: GenericMapComponent,
      Marker: GenericMapComponent,
      Circle: GenericMapComponent,
      Callout: GenericMapComponent,
      success: false,
    };
  }
};

// Hook para manejar el estado de los mapas
const useMapComponents = () => {
  const [mapState, setMapState] = useState<{
    components: ReturnType<typeof getMapComponents>;
    error: ErrorBoundaryState | null;
  }>({
    components: {
      MapView: GenericMapComponent,
      Marker: GenericMapComponent,
      Circle: GenericMapComponent,
      Callout: GenericMapComponent,
      success: false,
    },
    error: null,
  });

  const initializeMap = () => {
    const components = getMapComponents((error) => {
      setMapState((prev) => ({ ...prev, error }));
    });

    setMapState({
      components,
      error: components.success ? null : mapState.error,
    });
  };

  useEffect(() => {
    initializeMap();
  }, []);

  const retry = () => {
    setMapState((prev) => ({ ...prev, error: null }));
    initializeMap();
  };

  return { ...mapState, retry };
};

// Enhanced MapView wrapper with error boundary
const EnhancedMapView = React.forwardRef<MapViewRef, MapComponentProps>(
  ({ children, ...props }, ref) => {
    const { components, error, retry } = useMapComponents();
    const MapViewComponent = components.MapView;

    // Create internal ref for the actual map component
    const internalMapRef = React.useRef<any>(null);

    // Expose methods through imperative handle
    React.useImperativeHandle(
      ref,
      () => ({
        animateToRegion: (region: Region, duration?: number) => {
          if (
            components.success &&
            internalMapRef.current &&
            internalMapRef.current.animateToRegion
          ) {
            internalMapRef.current.animateToRegion(region, duration);
          } else {
            // Fallback: try to update region prop if available
            if (props.onRegionChangeComplete) {
              props.onRegionChangeComplete(region);
            }
          }
        },
        getCamera: () => {
          if (components.success && internalMapRef.current && internalMapRef.current.getCamera) {
            return internalMapRef.current.getCamera();
          }
          return Promise.resolve(null);
        },
        setCamera: (camera: any) => {
          if (components.success && internalMapRef.current && internalMapRef.current.setCamera) {
            internalMapRef.current.setCamera(camera);
          }
        },
      }),
      [components.success, props.onRegionChangeComplete]
    );

    if (error) {
      return (
        <MapErrorComponent error={error} onRetry={retry} style={props.style}>
          {children}
        </MapErrorComponent>
      );
    }

    return (
      <MapViewComponent ref={internalMapRef} {...props}>
        {children}
      </MapViewComponent>
    );
  }
);

EnhancedMapView.displayName = 'EnhancedMapView';

// Export enhanced components
export const PlatformMapView = EnhancedMapView;

export const PlatformMarker = (props: MapComponentProps) => {
  if (Platform.OS === 'web') {
    return <View {...props} />;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const RNMaps = require('react-native-maps');
    const MarkerComponent = RNMaps.Marker;
    return <MarkerComponent {...props} />;
  } catch {
    return <View {...props} />;
  }
};

export const PlatformCircle = (props: MapComponentProps) => {
  if (Platform.OS === 'web') {
    return <View {...props} />;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const RNMaps = require('react-native-maps');
    const CircleComponent = RNMaps.Circle;
    return <CircleComponent {...props} />;
  } catch {
    return <View {...props} />;
  }
};

export const PlatformCallout = (props: MapComponentProps) => {
  if (Platform.OS === 'web') {
    return <View {...props} />;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const RNMaps = require('react-native-maps');
    const CalloutComponent = RNMaps.Callout;
    return <CalloutComponent {...props} />;
  } catch {
    return <View {...props} />;
  }
};

// Export types
export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Ref type for MapView with methods
export interface MapViewRef {
  animateToRegion: (region: Region, duration?: number) => void;
  getCamera: () => Promise<any>;
  setCamera: (camera: any) => void;
  // Add other MapView methods as needed
}
