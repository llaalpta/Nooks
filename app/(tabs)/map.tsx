import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'react-native';
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
    latitude: 40.4168,
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

  const pendingRegionRef = useRef<Region | null>(null);

  const { handleMapReady, getMarkerImageSource } = useMapMarkers({
    imagePath: '@/assets/images/realm-final.png',
  });

  const { isLocating, getCurrentLocation, requestLocationPermission, hasPermission } =
    useLocationService({
      onLocationObtained: (coords) => {
        setUserLocation(coords);

        // if there are no realms, center map on user location
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

  // Utility to compare regions with tolerance
  function areRegionsEqual(r1: Region, r2: Region, tolerance = 0.0002) {
    return (
      Math.abs(r1.latitude - r2.latitude) < tolerance &&
      Math.abs(r1.longitude - r2.longitude) < tolerance &&
      Math.abs(r1.latitudeDelta - r2.latitudeDelta) < tolerance &&
      Math.abs(r1.longitudeDelta - r2.longitudeDelta) < tolerance
    );
  }

  // request location permission
  useEffect(() => {
    const initializeLocation = async () => {
      await requestLocationPermission();
      if (hasPermission) {
        await getCurrentLocation();
      }
    };

    initializeLocation();
  }, []);

  // center map on realms when they are loaded
  useEffect(() => {
    if (realms && realms.length > 0) {
      centerMapOnRealms();
    }
  }, [realms]);

  const centerMapOnRealms = () => {
    if (!realms || realms.length === 0) return;

    const validRealms = realms.filter((realm) => realm.latitude && realm.longitude);
    if (validRealms.length === 0) return;

    // calculate bounds of all realms
    const latitudes = validRealms.map((realm) => realm.latitude!);
    const longitudes = validRealms.map((realm) => realm.longitude!);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // add padding to deltas
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
        // zoom out first, then animate to actual destination
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
        // small delta change to force animation
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

  // only update state if region actually changed
  const handleRegionChangeComplete = (newRegion: Region) => {
    if (!areRegionsEqual(region, newRegion)) {
      setRegion(newRegion);
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
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
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
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
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
          customMapStyle={theme.dark ? darkMapStyle : []}
        >
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

          {validRealms.map((realm) => (
            <Marker
              key={realm.id}
              coordinate={{
                latitude: realm.latitude!,
                longitude: realm.longitude!,
              }}
              onPress={() => handleRealmPress(realm)}
            >
              <Image
                source={getMarkerImageSource()}
                style={{ width: 40, height: 55, resizeMode: 'contain' }}
              />
            </Marker>
          ))}
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
              <Text style={styles.mapButtonText}>LISTA</Text>
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
