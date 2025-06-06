// hooks/useLocationService.ts
// Hook unificado para manejo de ubicación en todos los componentes de mapas

import * as Location from 'expo-location';
import { useState } from 'react';
import { Alert } from 'react-native';

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

  // Solicitar permisos de ubicación
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

  // Obtener ubicación actual
  const getCurrentLocation = async (): Promise<LocationCoords | null> => {
    setIsLocating(true);

    try {
      // Verificar/solicitar permisos
      const hasPermissionGranted = hasPermission ?? (await requestLocationPermission());

      if (!hasPermissionGranted) {
        Alert.alert(
          'Permiso requerido',
          'Activa los permisos de ubicación para usar esta función.',
          [{ text: 'OK' }]
        );
        setIsLocating(false);
        return null;
      }

      // Obtener ubicación
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: LocationCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Validar área si se proporciona validador
      if (options.validateArea && !options.validateArea(coords)) {
        Alert.alert(
          'Fuera del área',
          options.areaValidationMessage || 'Tu ubicación actual está fuera del área permitida.'
        );
        setIsLocating(false);
        return null;
      }

      // Notificar éxito
      if (options.onLocationObtained) {
        options.onLocationObtained(coords);
      }

      setIsLocating(false);
      return coords;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const errorMessage =
        'No se pudo obtener tu ubicación actual. Verifica que el GPS esté activado.';

      Alert.alert('Error', errorMessage);

      if (options.onLocationError) {
        options.onLocationError(errorMessage);
      }

      setIsLocating(false);
      return null;
    }
  };

  // Verificar si una ubicación está dentro de un área circular
  const isLocationInArea = (
    location: LocationCoords,
    center: LocationCoords,
    radiusInMeters: number
  ): boolean => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371000; // Radio de la tierra en metros

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
