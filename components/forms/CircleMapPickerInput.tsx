// Mejoras sugeridas para tu CircleMapPickerInput existente
// Archivo: components/forms/CircleMapPickerInput.tsx

import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { useFormContext, Controller, Path } from 'react-hook-form';
import { View, StyleProp, ViewStyle, TouchableOpacity, ActivityIndicator } from 'react-native';

// ✅ Import corregido - quitar MapPressEvent
import { Text } from '@/components/atoms/Text';
import {
  PlatformMapView as MapView,
  PlatformMarker as Marker,
  PlatformCircle as Circle,
  Region,
} from '@/components/common/PlatformMap';
import { useAppTheme } from '@/contexts/ThemeContext';
import darkMapStyle from '@/styles/app/tabs/map.style';

import { createStyles } from './styles/MapPickerInput.styles';

// ✅ Comprobación del marcador - Al principio del archivo
let realmMarkerImage;
try {
  realmMarkerImage = require('@/assets/images/realm-marker.png');
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Imagen del marcador no encontrada, usando default', error);
  realmMarkerImage = null;
}

type CircleLocation = {
  latitude: number;
  longitude: number;
  radius: number;
};

interface CircleMapPickerInputProps<T extends object> {
  name: Path<T>;
  label?: string;
  initialRegion?: Region;
  minRadius?: number;
  maxRadius?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const CircleMapPickerInput = <T extends object>({
  name,
  label,
  initialRegion = {
    latitude: 40.4168, // Madrid por defecto
    longitude: -3.7038,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
  minRadius = 5,
  maxRadius = 1000,
  disabled,
  style,
}: CircleMapPickerInputProps<T>) => {
  const { control } = useFormContext<T>();
  const [region, setRegion] = useState<Region>(initialRegion);
  const [locating, setLocating] = useState(false);
  const theme = useAppTheme();
  const styles = createStyles(theme);

  async function centerOnCurrentLocation(
    onChange: (coords: CircleLocation) => void,
    currentValue?: CircleLocation
  ) {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // eslint-disable-next-line no-console
        console.log('Permisos de ubicación denegados');
        setLocating(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);
      onChange({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        radius: currentValue?.radius || 100,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error al obtener ubicación:', error);
    } finally {
      setLocating(false);
    }
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const circleLocation = value as CircleLocation | undefined;
        return (
          <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={styles.mapContainer}>
              <MapView
                style={{ flex: 1 }}
                region={region}
                onRegionChangeComplete={setRegion}
                onPress={(e: any) => {
                  // ✅ Cambiar tipo a any
                  if (disabled) return;
                  const { latitude, longitude } = e.nativeEvent.coordinate;
                  onChange({
                    latitude,
                    longitude,
                    radius: circleLocation?.radius || 100,
                  });
                }}
                pointerEvents={disabled ? 'none' : 'auto'}
                customMapStyle={theme.dark ? darkMapStyle : undefined}
              >
                {circleLocation?.latitude && circleLocation?.longitude && (
                  <>
                    {/* ✅ Marcador mejorado con fallback */}
                    <Marker
                      coordinate={{
                        latitude: circleLocation.latitude,
                        longitude: circleLocation.longitude,
                      }}
                      {...(realmMarkerImage
                        ? { image: realmMarkerImage }
                        : { pinColor: '#6366f1' })}
                    />

                    {/* Círculo para mostrar el radio */}
                    <Circle
                      center={{
                        latitude: circleLocation.latitude,
                        longitude: circleLocation.longitude,
                      }}
                      radius={circleLocation.radius}
                      fillColor={`${theme.colors.primary}20`}
                      strokeColor={theme.colors.primary}
                      strokeWidth={2}
                    />
                  </>
                )}
              </MapView>

              {/* Botón de mi ubicación estilo mapa principal */}
              <View style={styles.topRightButton}>
                <TouchableOpacity
                  style={[styles.mapButton, locating && styles.mapButtonLoading]}
                  onPress={() => centerOnCurrentLocation(onChange, circleLocation)}
                  disabled={locating || disabled}
                >
                  {locating ? (
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
              </View>

              {/* Panel de control de radio en la parte inferior del mapa */}
              {circleLocation?.latitude && circleLocation?.longitude && (
                <View style={styles.radiusControlPanel}>
                  <View style={styles.radiusHeader}>
                    <Ionicons name="resize-outline" size={16} color={theme.colors.onSurface} />
                    <Text style={styles.radiusLabel}>
                      Radio: {circleLocation.radius.toFixed(0)}m
                    </Text>
                  </View>

                  <View style={styles.sliderContainer}>
                    <Text style={styles.sliderMinLabel}>{minRadius}m</Text>
                    <Slider
                      style={styles.slider}
                      minimumValue={minRadius}
                      maximumValue={maxRadius}
                      value={circleLocation.radius}
                      onValueChange={(radius) => {
                        onChange({
                          latitude: circleLocation.latitude,
                          longitude: circleLocation.longitude,
                          radius: radius,
                        });
                      }}
                      minimumTrackTintColor={theme.colors.primary}
                      maximumTrackTintColor={theme.colors.outline}
                      thumbTintColor={theme.colors.primary}
                      disabled={disabled}
                    />
                    <Text style={styles.sliderMaxLabel}>{maxRadius}m</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Información de coordenadas mejorada */}
            <View style={styles.infoContainer}>
              <Text style={styles.coordsText}>
                {circleLocation?.latitude && circleLocation?.longitude
                  ? `📍 Lat: ${circleLocation.latitude.toFixed(5)}, Lng: ${circleLocation.longitude.toFixed(5)}`
                  : '👆 Toca el mapa para seleccionar ubicación'}
              </Text>
            </View>

            {error && <Text style={styles.errorText}>{error?.message}</Text>}
          </View>
        );
      }}
    />
  );
};
