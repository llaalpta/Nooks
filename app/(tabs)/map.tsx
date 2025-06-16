import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import BottomRealmsList from '@/components/common/BottomRealmsList';
import LoadingScreen from '@/components/common/LoadingScreen';
import {
  PlatformMapView as MapView,
  PlatformMarker as Marker,
  PlatformCircle as Circle,
  Region,
  MapViewRef,
} from '@/components/common/PlatformMap';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useRealmsQuery } from '@/features/realms/hooks';
import { useLocationService } from '@/hooks/useLocationService';
import darkMapStyle from '@/styles/app/tabs/map.dark.style';
import { createStyles } from '@/styles/app/tabs/map.style';

import type { Tables } from '@/types/supabase';

type Realm = Tables<'locations'>;

// Tipo para coordenadas
type Coordinates = {
  latitude: number;
  longitude: number;
};

export default function MapScreen() {
  const { user } = useAuth();
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const mapRef = useRef<MapViewRef | null>(null);
  const isMountedRef = useRef(true);
  const pendingRegionRef = useRef<Region | null>(null);
  const hasInitializedRef = useRef(false);

  // Pre-cargar la imagen una sola vez
  const [markerImage, setMarkerImage] = useState<any>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // ✅ Inicializar region como null - se calculará basada en realms
  const [region, setRegion] = useState<Region | null>(null);

  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [showRealmsList, setShowRealmsList] = useState(false);
  const [selectedRealm, setSelectedRealm] = useState<Realm | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: realms, isLoading, error } = useRealmsQuery(user?.id || '');

  // Memoizar validaciones para evitar re-cálculos
  const isValidNumber = useCallback((value: any): value is number => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }, []);

  const isValidRealm = useCallback(
    (realm: any): realm is Realm => {
      return realm && realm.id && isValidNumber(realm.latitude) && isValidNumber(realm.longitude);
    },
    [isValidNumber]
  );

  // Memoizar realms válidos
  const validRealms = useMemo(() => {
    return realms?.filter(isValidRealm) || [];
  }, [realms, isValidRealm]);

  const areRegionsEqual = useCallback((r1: Region, r2: Region, tolerance = 0.0002): boolean => {
    try {
      return (
        Math.abs(r1.latitude - r2.latitude) < tolerance &&
        Math.abs(r1.longitude - r2.longitude) < tolerance &&
        Math.abs(r1.latitudeDelta - r2.latitudeDelta) < tolerance &&
        Math.abs(r1.longitudeDelta - r2.longitudeDelta) < tolerance
      );
    } catch (error) {
      console.error('MapScreen: Error comparing regions:', error);
      return false;
    }
  }, []);

  // Memoizar función de centrado de mapa - ahora es la inicialización principal
  const initializeMapRegion = useCallback(() => {
    try {
      // ✅ Solo establecer región si tenemos realms o si ya no está cargando
      if (!validRealms || validRealms.length === 0) {
        if (isLoading) {
          return; // No establecer región aún, esperar a que terminen de cargar
        }

        // Solo usar región por defecto si confirmamos que NO hay realms
        const defaultRegion = {
          latitude: 40.0, // Volver a España ya que sabemos que funciona
          longitude: -3.0,
          latitudeDelta: 8.0,
          longitudeDelta: 12.0,
        };
        setRegion(defaultRegion);
        return;
      }

      const latitudes = validRealms.map((realm) => realm.latitude as number);
      const longitudes = validRealms.map((realm) => realm.longitude as number);

      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);

      if (
        !isValidNumber(minLat) ||
        !isValidNumber(maxLat) ||
        !isValidNumber(minLng) ||
        !isValidNumber(maxLng)
      ) {
        return;
      }

      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;
      const latDelta = Math.max((maxLat - minLat) * 1.3, 0.01);
      const lngDelta = Math.max((maxLng - minLng) * 1.3, 0.01);

      const newRegion = {
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      };

      if (
        !isValidNumber(newRegion.latitude) ||
        !isValidNumber(newRegion.longitude) ||
        !isValidNumber(newRegion.latitudeDelta) ||
        !isValidNumber(newRegion.longitudeDelta)
      ) {
        return;
      }

      setRegion(newRegion);
    } catch (error) {
      console.error('MapScreen: Error calculating initial map region:', error);
    }
  }, [validRealms, isValidNumber, realms, isLoading]);

  // ✅ Callback tipado correctamente - solo se ejecuta si es necesario
  const onLocationObtained = useCallback(
    (coords: Coordinates) => {
      try {
        if (
          !coords ||
          typeof coords.latitude !== 'number' ||
          typeof coords.longitude !== 'number' ||
          !isValidNumber(coords.latitude) ||
          !isValidNumber(coords.longitude)
        ) {
          console.warn('MapScreen: Invalid coordinates received:', coords);
          return;
        }

        setUserLocation(coords);
      } catch (error) {
        console.error('MapScreen: Error processing location:', error);
      }
    },
    [isValidNumber]
  );

  const { isLocating, getCurrentLocation, requestLocationPermission, hasPermission } =
    useLocationService({
      onLocationObtained,
    });

  // Cargar imagen al inicializar - solo una vez
  useEffect(() => {
    if (imageLoaded) return;

    try {
      const image = require('@/assets/images/realm-final.png');
      setMarkerImage(image);
      setImageLoaded(true);
    } catch (error) {
      console.error('MapScreen: Error pre-loading marker image:', error);
      setImageLoaded(false);
    }
  }, [imageLoaded]);

  // Inicializar el mapa directamente - sin depender de permisos
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    setIsInitialized(true);
  }, []);

  // Inicializar región del mapa - esperar a que los datos estén listos
  useEffect(() => {
    // Solo intentar inicializar cuando:
    // 1. El componente esté inicializado
    // 2. No tengamos región aún
    // 3. Los datos hayan terminado de cargar O tengamos realms
    if (isInitialized && !region && (!isLoading || validRealms.length > 0)) {
      initializeMapRegion();
    }
  }, [isInitialized, region, isLoading, validRealms.length, initializeMapRegion]);

  // Función unificada para seleccionar y enfocar un realm
  const selectAndFocusRealm = useCallback(
    (realm: Realm) => {
      try {
        if (!isValidRealm(realm)) {
          console.warn('MapScreen: Invalid realm data received');
          return;
        }

        setSelectedRealm(realm);

        if (!region) return;

        // Calcular el nivel de zoom dinámicamente basado en la distancia actual
        const latDiff = Math.abs(region.latitude - (realm.latitude as number));
        const lngDiff = Math.abs(region.longitude - (realm.longitude as number));

        let delta = 0.005; // Zoom cercano por defecto
        if (latDiff > 0.2 || lngDiff > 0.2) {
          delta = 0.05; // Zoom medio si está muy lejos
        } else if (latDiff > 0.05 || lngDiff > 0.05) {
          delta = 0.01; // Zoom intermedio si está moderadamente lejos
        }

        const newRegion: Region = {
          latitude: realm.latitude as number,
          longitude: realm.longitude as number,
          latitudeDelta: delta,
          longitudeDelta: delta,
        };

        if (!mapRef.current || !isMountedRef.current) return;

        // Lógica especial para animaciones suaves cuando el realm está muy cerca
        if (
          Math.abs(region.latitude - newRegion.latitude) < 0.0001 &&
          Math.abs(region.longitude - newRegion.longitude) < 0.0001 &&
          (region.latitudeDelta < 0.01 || region.longitudeDelta < 0.01)
        ) {
          // Zoom out primero, luego animar al destino
          const zoomOutRegion = {
            ...newRegion,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          };
          mapRef.current.animateToRegion(zoomOutRegion, 400);
          pendingRegionRef.current = newRegion;
        } else if (
          Math.abs(region.latitude - newRegion.latitude) < 0.0001 &&
          Math.abs(region.longitude - newRegion.longitude) < 0.0001
        ) {
          // Pequeño cambio de delta para forzar animación
          const tempRegion = {
            ...newRegion,
            latitudeDelta: newRegion.latitudeDelta + 0.002,
            longitudeDelta: newRegion.longitudeDelta + 0.002,
          };
          mapRef.current.animateToRegion(tempRegion, 200);
          pendingRegionRef.current = newRegion;
        } else {
          // Animación normal
          mapRef.current.animateToRegion(newRegion, 1200);
        }
      } catch (error) {
        console.error('MapScreen: Error selecting and focusing realm:', error);
      }
    },
    [isValidRealm, region]
  );

  // Handlers memoizados
  const centerOnUserLocation = useCallback(async () => {
    try {
      // Solicitar permisos justo cuando se necesiten
      if (!hasPermission) {
        const permissionGranted = await requestLocationPermission();

        if (!permissionGranted) {
          Alert.alert(
            'Permisos requeridos',
            'La aplicación necesita acceso a tu ubicación para centrarse en tu posición.',
            [{ text: 'OK' }]
          );
          return;
        }
      }

      const location = await getCurrentLocation();

      if (location && isValidNumber(location.latitude) && isValidNumber(location.longitude)) {
        const newRegion = {
          ...location,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(newRegion);
        setUserLocation(location);

        if (mapRef.current && isMountedRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      } else {
        Alert.alert('Error', 'No se pudo obtener tu ubicación. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('MapScreen: Error centering on user location:', error);
      Alert.alert('Error', 'No se pudo obtener tu ubicación. Inténtalo de nuevo.');
    }
  }, [hasPermission, getCurrentLocation, requestLocationPermission, isValidNumber]);

  // Handler para cuando se toca un marcador en el mapa
  const handleRealmPress = useCallback(
    (realm: Realm) => {
      selectAndFocusRealm(realm);
    },
    [selectAndFocusRealm]
  );

  const handleRealmDetails = useCallback(() => {
    if (selectedRealm?.id) {
      router.push({ pathname: '/realms/[id]', params: { id: selectedRealm.id, returnTo: 'map' } });
    }
  }, [selectedRealm?.id]);

  const handleMapPress = useCallback(() => {
    setSelectedRealm(null);
  }, []);

  const handleCreateRealm = useCallback(() => {
    router.push({ pathname: '/realms/realm-form', params: { from: 'map' } });
  }, []);

  const toggleRealmsList = useCallback(async () => {
    if (showRealmsList) {
      // Si ya está abierto, simplemente cerrarlo
      setShowRealmsList(false);
      return;
    }

    try {
      // Para mostrar "realms cercanos" necesitamos la ubicación del usuario
      if (!userLocation) {
        if (!hasPermission) {
          const permissionGranted = await requestLocationPermission();

          if (!permissionGranted) {
            Alert.alert(
              'Permisos requeridos',
              'Para mostrar los realms cercanos necesitamos acceso a tu ubicación.',
              [{ text: 'OK' }]
            );
            return;
          }
        }

        const location = await getCurrentLocation();

        if (!location || !isValidNumber(location.latitude) || !isValidNumber(location.longitude)) {
          Alert.alert(
            'Error de ubicación',
            'No se pudo obtener tu ubicación para mostrar los realms cercanos.',
            [{ text: 'OK' }]
          );
          return;
        }

        setUserLocation(location);
      }

      // Si llegamos aquí, tenemos ubicación del usuario
      setShowRealmsList(true);
    } catch (error) {
      console.error('MapScreen: Error getting location for realms list:', error);
      Alert.alert('Error', 'No se pudo obtener tu ubicación. Inténtalo de nuevo.', [
        { text: 'OK' },
      ]);
    }
  }, [
    showRealmsList,
    userLocation,
    hasPermission,
    requestLocationPermission,
    getCurrentLocation,
    isValidNumber,
  ]);

  // Handler para cuando se selecciona un realm de la lista
  const handleRealmSelect = useCallback(
    (realm: Realm) => {
      setShowRealmsList(false); // Cerrar la lista
      selectAndFocusRealm(realm);
    },
    [selectAndFocusRealm]
  );

  const handleRegionChangeComplete = useCallback(
    (newRegion: Region) => {
      try {
        if (!newRegion || !region) return;

        if (
          !isValidNumber(newRegion.latitude) ||
          !isValidNumber(newRegion.longitude) ||
          !isValidNumber(newRegion.latitudeDelta) ||
          !isValidNumber(newRegion.longitudeDelta)
        ) {
          console.warn('MapScreen: Invalid region data received');
          return;
        }

        if (!areRegionsEqual(region, newRegion)) {
          setRegion(newRegion);
          if (pendingRegionRef.current && mapRef.current && isMountedRef.current) {
            mapRef.current.animateToRegion(pendingRegionRef.current, 1200);
            pendingRegionRef.current = null;
          }
        }
      } catch (error) {
        console.error('MapScreen: Error handling region change:', error);
      }
    },
    [region, areRegionsEqual, isValidNumber]
  );

  // Memoizar componentes de marcadores para evitar re-renders
  const renderMarkers = useMemo(() => {
    return validRealms.map((realm) => {
      const coordinate = {
        latitude: realm.latitude as number,
        longitude: realm.longitude as number,
      };

      // ✅ Pasar key directamente, no en el spread
      if (imageLoaded && markerImage) {
        return (
          <Marker
            key={realm.id}
            coordinate={coordinate}
            onPress={() => handleRealmPress(realm)}
            image={markerImage}
          />
        );
      } else {
        return (
          <Marker
            key={realm.id}
            coordinate={coordinate}
            onPress={() => handleRealmPress(realm)}
            pinColor="#6366f1"
          />
        );
      }
    });
  }, [validRealms, imageLoaded, markerImage, handleRealmPress]);

  // Validar región antes de renderizar
  const isRegionValid =
    region &&
    isValidNumber(region.latitude) &&
    isValidNumber(region.longitude) &&
    isValidNumber(region.latitudeDelta) &&
    isValidNumber(region.longitudeDelta) &&
    region.latitudeDelta > 0 &&
    region.longitudeDelta > 0;

  // Early returns
  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No hay usuario autenticado</Text>
          <Button mode="outlined" onPress={() => router.push('/(auth)/login')}>
            Iniciar sesión
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading || !isInitialized || !region) {
    return <LoadingScreen message="Cargando mapa..." />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error al cargar los realms</Text>
          <Button mode="outlined" onPress={() => router.replace('/(tabs)/map')}>
            Reintentar
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  if (!isRegionValid) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se puede mostrar el mapa: región inválida.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onRegionChangeComplete={handleRegionChangeComplete}
          showsUserLocation={hasPermission}
          showsMyLocationButton={false}
          onPress={handleMapPress}
          customMapStyle={theme.dark ? darkMapStyle : []}
          showsBuildings={false} // Desactiva edificios 3D
          showsTraffic={false}  // Desactiva tráfico
          showsIndoors={false}  // Opcional: desactiva interiores
        >
          {selectedRealm &&
            isValidRealm(selectedRealm) &&
            selectedRealm.radius &&
            isValidNumber(selectedRealm.radius) &&
            selectedRealm.radius > 0 && (
              <Circle
                center={{
                  latitude: selectedRealm.latitude as number,
                  longitude: selectedRealm.longitude as number,
                }}
                radius={selectedRealm.radius as number}
                fillColor={`${theme.colors.primary}20`}
                strokeColor={theme.colors.primary}
                strokeWidth={2}
              />
            )}

          {renderMarkers}
        </MapView>

        <View style={styles.topRightButtons}>
          <TouchableOpacity
            style={[styles.mapButton, isLocating && styles.mapButtonLoading]}
            onPress={centerOnUserLocation}
            disabled={isLocating}
          >
            {isLocating ? (
              <>
                <ActivityIndicator size={16} color={theme.colors.onPrimary} />
                <Text style={styles.mapButtonText}>BUSCANDO...</Text>
              </>
            ) : (
              <>
                <Ionicons name="locate" size={16} color={theme.colors.onPrimary} />
                <Text style={styles.mapButtonText}>MI UBICACIÓN</Text>
              </>
            )}
          </TouchableOpacity>

          {selectedRealm && (
            <TouchableOpacity style={styles.mapButton} onPress={handleRealmDetails}>
              <Ionicons name="information-circle" size={16} color={theme.colors.onPrimary} />
              <Text style={styles.mapButtonText}>VER DETALLES</Text>
            </TouchableOpacity>
          )}
        </View>

        {validRealms.length > 0 && (
          <View style={styles.bottomLeftButtons}>
            <TouchableOpacity style={styles.addButton} onPress={handleCreateRealm}>
              <Ionicons name="add" size={24} color={theme.colors.onPrimary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.mapButton} onPress={toggleRealmsList}>
              <Ionicons name="list" size={16} color={theme.colors.onPrimary} />
              <Text style={styles.mapButtonText}>REALMS CERCANOS</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {showRealmsList && validRealms.length > 0 && (
        <BottomRealmsList
          realms={validRealms}
          userLocation={userLocation}
          onRealmSelect={handleRealmSelect}
          onClose={() => setShowRealmsList(false)}
        />
      )}
    </SafeAreaView>
  );
}
