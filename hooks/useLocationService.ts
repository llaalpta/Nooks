import * as Location from 'expo-location';
import { useState } from 'react';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface UseLocationServiceOptions {
  onLocationObtained?: (coords: LocationCoords) => void;
  onLocationError?: (error: string) => void;
  validateArea?: (coords: LocationCoords) => boolean;
  areaValidationMessage?: string;
}

export const useLocationService = (options: UseLocationServiceOptions = {}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // ask for location permission
  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setHasPermission(false);
      return false;
    }
  };
  const getCurrentLocation = async (): Promise<LocationCoords | null> => {
    setIsLocating(true);

    try {
      // Check/request permissions
      const hasPermissionGranted = hasPermission ?? (await requestLocationPermission());

      if (!hasPermissionGranted) {
        console.error('Activa los permisos de ubicación para usar esta función.');
        setIsLocating(false);
        return null;
      }

      // Add timeout for location request to prevent hanging
      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000, // 10 seconds timeout
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Location request timeout')), 15000)
      );

      const location = await Promise.race([locationPromise, timeoutPromise]);

      // Validate location data
      if (
        !location?.coords ||
        typeof location.coords.latitude !== 'number' ||
        typeof location.coords.longitude !== 'number' ||
        isNaN(location.coords.latitude) ||
        isNaN(location.coords.longitude)
      ) {
        throw new Error('Invalid location data received');
      }

      const coords: LocationCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      if (options.validateArea && !options.validateArea(coords)) {
        console.error(
          options.areaValidationMessage || 'Tu ubicación actual está fuera del área permitida.'
        );
        setIsLocating(false);
        return null;
      }

      if (options.onLocationObtained) {
        options.onLocationObtained(coords);
      }

      setIsLocating(false);
      return coords;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message.includes('timeout')
          ? 'Se agotó el tiempo de espera para obtener la ubicación. Inténtalo de nuevo.'
          : 'No se pudo obtener tu ubicación actual. Verifica que el GPS esté activado.';

      console.error('Location error:', errorMessage, error);

      if (options.onLocationError) {
        options.onLocationError(errorMessage);
      }

      setIsLocating(false);
      return null;
    }
  };

  // Check if a location is within a circular area
  const isLocationInArea = (
    location: LocationCoords,
    center: LocationCoords,
    radiusInMeters: number
  ): boolean => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371000; // Earth's radius in meters

    const dLat = toRad(location.latitude - center.latitude);
    const dLng = toRad(location.longitude - center.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(center.latitude)) *
        Math.cos(toRad(location.latitude)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance <= radiusInMeters;
  };

  return {
    isLocating,
    hasPermission,
    getCurrentLocation,
    requestLocationPermission,
    isLocationInArea,
  };
};
