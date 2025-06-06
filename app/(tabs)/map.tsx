import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
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
import { useMapMarkers } from '@/hooks/useMapMarkers';
import { createStyles } from '@/styles/app/tabs/map.style';
import darkMapStyle from '@/styles/app/tabs/map.style';

import type { Tables } from '@/types/supabase';

type Realm = Tables<'locations'>;

export default function MapScreen() {
  const { user } = useAuth();
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const mapRef = useRef<MapViewRef | null>(null);

  const [region, setRegion] = useState<Region>({
    latitude: 40.4168, // Madrid por defecto
    longitude: -3.7038,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [showRealmsList, setShowRealmsList] = useState(false);
  const [selectedRealm, setSelectedRealm] = useState<Realm | null>(null);
  const { data: realms, isLoading, error } = useRealmsQuery(user?.id || '');

  // Ref para guardar una región pendiente de animar
  const pendingRegionRef = useRef<Region | null>(null);

  // Usar hooks unificados
  const { handleMapReady, getMarkerProps } = useMapMarkers();

  const { isLocating, getCurrentLocation, requestLocationPermission, hasPermission } =
    useLocationService({
      onLocationObtained: (coords) => {
        setUserLocation(coords);

        // Si no hay realms, centrar en la ubicación del usuario
        if (!realms || realms.length === 0) {
          const newRegion = {
            ...coords,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setRegion(newRegion);
        }
      },
    });

  // Utilidad para comparar regiones con tolerancia
  function areRegionsEqual(r1: Region, r2: Region, tolerance = 0.0002) {
    return (
      Math.abs(r1.latitude - r2.latitude) < tolerance &&
      Math.abs(r1.longitude - r2.longitude) < tolerance &&
      Math.abs(r1.latitudeDelta - r2.latitudeDelta) < tolerance &&
      Math.abs(r1.longitudeDelta - r2.longitudeDelta) < tolerance
    );
  }

  // Solicitar permisos de ubicación al cargar el componente
  useEffect(() => {
    const initializeLocation = async () => {
      await requestLocationPermission();
      // Obtener ubicación inicial si hay permisos
      if (hasPermission) {
        await getCurrentLocation();
      }
    };

    initializeLocation();
  }, []);

  // Centrar el mapa en los realms cuando se cargan
  useEffect(() => {
    if (realms && realms.length > 0) {
      centerMapOnRealms();
    }
  }, [realms]);

  const centerMapOnRealms = () => {
    if (!realms || realms.length === 0) return;

    const validRealms = realms.filter((realm) => realm.latitude && realm.longitude);
    if (validRealms.length === 0) return;

    // Calcular los límites de todos los realms
    const latitudes = validRealms.map((realm) => realm.latitude!);
    const longitudes = validRealms.map((realm) => realm.longitude!);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // Agregar padding a los deltas
    const latDelta = Math.max((maxLat - minLat) * 1.3, 0.01);
    const lngDelta = Math.max((maxLng - minLng) * 1.3, 0.01);

    setRegion({
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    });
  };

  const centerOnUserLocation = async () => {
    if (!hasPermission) {
      Alert.alert(
        'Permisos requeridos',
        'La aplicación necesita acceso a tu ubicación para centrarse en tu posición.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Configurar', onPress: () => requestLocationPermission() },
        ]
      );
      return;
    }

    const location = await getCurrentLocation();
    if (location) {
      const newRegion = {
        ...location,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);
      setUserLocation(location);

      // Animar a la nueva región
      mapRef.current?.animateToRegion(newRegion, 1000);
    }
  };

  const handleRealmPress = (realm: Realm) => {
    setSelectedRealm(realm);
    if (realm.latitude && realm.longitude) {
      const newRegion = {
        latitude: realm.latitude,
        longitude: realm.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapRef.current?.animateToRegion(newRegion, 1200);
    }
  };

  const handleRealmDetails = () => {
    if (selectedRealm) {
      router.push(`/realms/${selectedRealm.id}`);
    }
  };

  const handleMapPress = () => {
    setSelectedRealm(null);
  };

  const handleCreateRealm = () => {
    router.push({ pathname: '/realms/realm-form', params: { from: 'map' } });
  };

  const toggleRealmsList = () => {
    setShowRealmsList(!showRealmsList);
  };

  const handleRealmSelect = (realm: Realm) => {
    setShowRealmsList(false);
    setSelectedRealm(realm);

    if (realm.latitude && realm.longitude) {
      const latDiff = Math.abs(region.latitude - realm.latitude);
      const lngDiff = Math.abs(region.longitude - realm.longitude);

      let delta = 0.003;
      if (latDiff > 0.2 || lngDiff > 0.2) {
        delta = 0.05;
      } else if (latDiff > 0.05 || lngDiff > 0.05) {
        delta = 0.01;
      }

      const newRegion = {
        latitude: realm.latitude,
        longitude: realm.longitude,
        latitudeDelta: delta,
        longitudeDelta: delta,
      };

      if (
        Math.abs(region.latitude - newRegion.latitude) < 0.0001 &&
        Math.abs(region.longitude - newRegion.longitude) < 0.0001 &&
        (region.latitudeDelta < 0.01 || region.longitudeDelta < 0.01)
      ) {
        // Zoom out primero, luego animar al destino real
        const zoomOutRegion = {
          ...newRegion,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        };
        mapRef.current?.animateToRegion(zoomOutRegion, 400);
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
        mapRef.current?.animateToRegion(tempRegion, 200);
        pendingRegionRef.current = newRegion;
      } else {
        mapRef.current?.animateToRegion(newRegion, 1200);
      }
    }
  };

  // Solo actualiza el estado si la región realmente cambió
  const handleRegionChangeComplete = (newRegion: Region) => {
    if (!areRegionsEqual(region, newRegion)) {
      setRegion(newRegion);
      // Si hay una región pendiente, animar a ella y limpiar el ref
      if (pendingRegionRef.current) {
        mapRef.current?.animateToRegion(pendingRegionRef.current, 1200);
        pendingRegionRef.current = null;
      }
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Cargando mapa..." />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error al cargar los realms</Text>
          <Button mode="outlined" onPress={() => requestLocationPermission()}>
            Reintentar
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const validRealms = realms?.filter((realm) => realm.latitude && realm.longitude) || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onRegionChangeComplete={handleRegionChangeComplete}
          onMapReady={handleMapReady}
          showsUserLocation={hasPermission}
          showsMyLocationButton={false}
          onPress={handleMapPress}
          customMapStyle={theme.dark ? darkMapStyle : undefined}
        >
          {/* Círculo para mostrar el radio del realm seleccionado */}
          {selectedRealm && selectedRealm.radius && (
            <Circle
              center={{
                latitude: selectedRealm.latitude!,
                longitude: selectedRealm.longitude!,
              }}
              radius={selectedRealm.radius}
              fillColor={`${theme.colors.primary}20`}
              strokeColor={theme.colors.primary}
              strokeWidth={2}
            />
          )}

          {/* Mostrar realms como marcadores con hooks unificados */}
          {validRealms.map((realm) => (
            <Marker
              key={realm.id}
              coordinate={{
                latitude: realm.latitude!,
                longitude: realm.longitude!,
              }}
              onPress={() => handleRealmPress(realm)}
              {...getMarkerProps()}
            />
          ))}
        </MapView>

        {/* Columna de botones en la esquina superior derecha */}
        <View style={styles.topRightButtons}>
          {/* Botón de mi ubicación */}
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

          {/* Botón de detalles del realm seleccionado */}
          {selectedRealm && (
            <TouchableOpacity style={styles.mapButton} onPress={handleRealmDetails}>
              <Ionicons name="information-circle" size={16} color={theme.colors.onPrimary} />
              <Text style={styles.mapButtonText}>VER DETALLES</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Botones en la esquina inferior izquierda */}
        {validRealms.length > 0 && (
          <View style={styles.bottomLeftButtons}>
            {/* Botón de añadir realm */}
            <TouchableOpacity style={styles.addButton} onPress={handleCreateRealm}>
              <Ionicons name="add" size={24} color={theme.colors.onPrimary} />
            </TouchableOpacity>

            {/* Botón de lista */}
            <TouchableOpacity style={styles.mapButton} onPress={toggleRealmsList}>
              <Ionicons name="list" size={16} color={theme.colors.onPrimary} />
              <Text style={styles.mapButtonText}>LISTA</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Lista de realms desplegable desde abajo */}
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
