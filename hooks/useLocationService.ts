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
      console.error('LocationService: Error requesting location permission:', error);
      setHasPermission(false);
      if (options.onLocationError) {
        options.onLocationError('Error al solicitar permisos de ubicación');
      }
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<LocationCoords | null> => {
    if (isLocating) {
      return null;
    }

    setIsLocating(true);

    try {
      // Check/request permissions
      const hasPermissionGranted = hasPermission ?? (await requestLocationPermission());

      if (!hasPermissionGranted) {
        const errorMsg = 'Activa los permisos de ubicación para usar esta función.';
        if (options.onLocationError) {
          options.onLocationError(errorMsg);
        }
        setIsLocating(false);
        return null;
      }

      // Usar configuración simple sin opciones no soportadas
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

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
        const errorMsg =
          options.areaValidationMessage || 'Tu ubicación actual está fuera del área permitida.';
        if (options.onLocationError) {
          options.onLocationError(errorMsg);
        }
        setIsLocating(false);
        return null;
      }

      if (options.onLocationObtained) {
        options.onLocationObtained(coords);
      }

      setIsLocating(false);
      return coords;
    } catch (error) {
      console.error('LocationService: Error getting location:', error);
      const errorMessage =
        'No se pudo obtener tu ubicación actual. Verifica que el GPS esté activado.';

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
    try {
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
    } catch (error) {
      console.error('LocationService: Error calculating distance:', error);
      return false;
    }
  };

  return {
    isLocating,
    hasPermission,
    getCurrentLocation,
    requestLocationPermission,
    isLocationInArea,
  };
};
