import { useState } from 'react';

import { useAppTheme } from '@/contexts/ThemeContext';

interface MarkerImageConfig {
  imagePath?: string;
  fallbackColor?: string;
}

export const useMapMarkers = (config: MarkerImageConfig = {}) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const theme = useAppTheme();

  const { imagePath: configuredPath, fallbackColor = theme.colors.primary || '#6366f1' } = config;

  // Devuelve el source de la imagen adecuada
  const getMarkerImageSource = () => {
    if (configuredPath && configuredPath.includes('nook')) {
      return require('@/assets/images/nook-final.png');
    } else if (configuredPath && configuredPath.includes('realm')) {
      return require('@/assets/images/realm-final.png');
    } else {
      return require('@/assets/images/realm-final.png');
    }
  };

  const handleMapReady = () => {
    setIsMapReady(true);
  };

  return {
    isMapReady,
    getMarkerImageSource,
    handleMapReady,
    fallbackColor,
  };
};
