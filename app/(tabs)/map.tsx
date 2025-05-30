import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import MapView, { Marker, Circle, Callout, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { FloatingActionButton } from '@/components/atoms/FloatingActionButton';
import { Text } from '@/components/atoms/Text';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useRealmsQuery } from '@/features/realms/hooks';

import { createStyles } from './styles/map.style';

import type { Tables } from '@/types/supabase';

type Realm = Tables<'locations'>;

export default function MapScreen() {
  const { user } = useAuth();
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);

  const [region, setRegion] = useState<Region>({
    latitude: 40.4168, // Madrid por defecto
    longitude: -3.7038,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { data: realms, isLoading, error } = useRealmsQuery(user?.id || '');

  // Solicitar permisos de ubicación al cargar el componente
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Centrar el mapa en los realms cuando se cargan
  useEffect(() => {
    if (realms && realms.length > 0) {
      centerMapOnRealms();
    }
  }, [realms]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const userCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(userCoords);

        // Si no hay realms, centrar en la ubicación del usuario
        if (!realms || realms.length === 0) {
          setRegion({
            latitude: userCoords.latitude,
            longitude: userCoords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      }
    } catch {
      console.error('Error al obtener ubicación');
    }
  };

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
    if (!hasLocationPermission) {
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

    try {
      const location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch {
      Alert.alert('Error', 'No se pudo obtener tu ubicación actual');
    }
  };

  const handleRealmPress = (realm: Realm) => {
    router.push(`/realms/${realm.id}`);
  };

  const handleCreateRealm = () => {
    router.push('/(modals)/realm-form');
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mapa de Reinos</Text>
        <Text style={styles.headerSubtitle}>
          {validRealms.length} reino{validRealms.length !== 1 ? 's' : ''} en el mapa
        </Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={hasLocationPermission}
          showsMyLocationButton={false}
        >
          {/* Mostrar ubicación del usuario si está disponible */}
          {userLocation && (
            <Marker coordinate={userLocation} title="Tu ubicación" pinColor="blue" />
          )}

          {/* Mostrar realms como marcadores con círculos */}
          {validRealms.map((realm) => (
            <React.Fragment key={realm.id}>
              {/* Círculo para mostrar el radio del realm */}
              {realm.radius && (
                <Circle
                  center={{
                    latitude: realm.latitude!,
                    longitude: realm.longitude!,
                  }}
                  radius={realm.radius}
                  fillColor={`${theme.colors.primary}20`}
                  strokeColor={theme.colors.primary}
                  strokeWidth={2}
                />
              )}

              {/* Marcador del realm */}
              <Marker
                coordinate={{
                  latitude: realm.latitude!,
                  longitude: realm.longitude!,
                }}
                pinColor={theme.colors.primary}
                onPress={() => handleRealmPress(realm)}
              >
                <Callout onPress={() => handleRealmPress(realm)}>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{realm.name}</Text>
                    {realm.description && (
                      <Text style={styles.calloutDescription} numberOfLines={2}>
                        {realm.description}
                      </Text>
                    )}
                    {realm.radius && (
                      <Text style={styles.calloutRadius}>Radio: {realm.radius.toFixed(0)}m</Text>
                    )}
                    <Text style={styles.calloutAction}>Toca para ver detalles</Text>
                  </View>
                </Callout>
              </Marker>
            </React.Fragment>
          ))}
        </MapView>

        {/* Botón para centrar en ubicación del usuario */}
        <View style={styles.locationButtonContainer}>
          <Button
            mode="contained"
            onPress={centerOnUserLocation}
            icon={<Ionicons name="locate" size={16} color={theme.colors.onPrimary} />}
            style={styles.locationButton}
          >
            Mi ubicación
          </Button>
        </View>

        {/* Botón para centrar en todos los realms */}
        {validRealms.length > 0 && (
          <View style={styles.realmsButtonContainer}>
            <Button
              mode="outlined"
              onPress={centerMapOnRealms}
              icon={<Ionicons name="map" size={16} color={theme.colors.primary} />}
              style={styles.realmsButton}
            >
              Ver todos
            </Button>
          </View>
        )}
      </View>

      {/* Botón flotante para crear nuevo realm */}
      <FloatingActionButton onPress={handleCreateRealm} icon="add" style={styles.fab} />
    </SafeAreaView>
  );
}
