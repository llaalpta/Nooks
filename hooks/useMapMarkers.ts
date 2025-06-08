import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

interface MarkerImageConfig {
  imagePath?: string;
  fallbackColor?: string;
}

export const useMapMarkers = (config: MarkerImageConfig = {}) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const [customMarkerImage, setCustomMarkerImage] = useState<any>(null);
  const theme = useAppTheme();

  const {
    imagePath = '@/assets/images/realm-marker-small.png',
    fallbackColor = theme.colors.primary || '#6366f1',
  } = config;

  // Cargar imagen personalizada después de que el mapa esté listo
  useEffect(() => {
    if (isMapReady && Platform.OS !== 'web') {
      const loadCustomMarker = () => {
        try {
          // Nota: En un proyecto real, necesitarías un sistema más dinámico para cargar imágenes
          // Por ahora, asumimos que la imagen está en la ruta estándar
          const markerImage = require('@/assets/images/realm-marker-small.png');
          setCustomMarkerImage(markerImage);
        } catch (error) {
          console.warn('No se pudo cargar la imagen personalizada del marcador:', error);
          // Continuar sin imagen personalizada
        }
      };

      loadCustomMarker();
    }
  }, [isMapReady, imagePath]);

  // Callback para cuando el mapa está listo
  const handleMapReady = () => {
    setIsMapReady(true);
  };

  // Obtener props del marcador (imagen o color)
  const getMarkerProps = () => {
    if (isMapReady && customMarkerImage) {
      // Ajusta el tamaño aquí según el marcador:
      // Realm: 32x46, Nook: 32x46 (ajusta si tu PNG es diferente)
      return {
        image: customMarkerImage,
        style: { width: 32, height: 46 },
      };
    }
    return { pinColor: fallbackColor };
  };

  // Reset del estado (útil para limpiar al desmontar)
  const resetMarkers = () => {
    setIsMapReady(false);
    setCustomMarkerImage(null);
  };

  return {
    isMapReady,
    customMarkerImage,
    handleMapReady,
    getMarkerProps,
    resetMarkers,
  };
};
