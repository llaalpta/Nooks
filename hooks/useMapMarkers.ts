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

  const { imagePath: configuredPath, fallbackColor = theme.colors.primary || '#6366f1' } = config;

  useEffect(() => {
    if (isMapReady && Platform.OS !== 'web') {
      const loadCustomMarker = () => {
        let imageToLoad;

        if (configuredPath && configuredPath.includes('nook')) {
          imageToLoad = require('@/assets/images/nook-big.png');
        } else if (configuredPath && configuredPath.includes('realm')) {
          imageToLoad = require('@/assets/images/realm-big.png');
        } else {
          // Default or if path is unrecognized for specific logic, try realm-big first
          imageToLoad = require('@/assets/images/realm-big.png');
        }

        try {
          setCustomMarkerImage(imageToLoad);
        } catch (error) {
          console.warn(
            `Could not set marker image (configured: ${configuredPath}). Falling back to default (realm-big.png). Error: `,
            error
          );
          try {
            setCustomMarkerImage(require('@/assets/images/realm-big.png'));
          } catch (e) {
            console.warn('Could not load final fallback marker image (realm-big.png):', e);
          }
        }
      };

      loadCustomMarker();
    }
  }, [isMapReady, configuredPath]);

  const handleMapReady = () => {
    setIsMapReady(true);
  };

  const getMarkerProps = () => {
    if (isMapReady && customMarkerImage) {
      return {
        image: customMarkerImage,
        style: { width: 32, height: 46 },
      };
    }
    return { pinColor: fallbackColor };
  };

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
