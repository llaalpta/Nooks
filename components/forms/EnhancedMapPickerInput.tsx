// components/forms/EnhancedMapPickerInput.tsx
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { useFormContext, Controller, Path } from 'react-hook-form';
import { View, StyleProp, ViewStyle, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Circle, MapPressEvent, Region, Marker } from 'react-native-maps';

import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createEnhancedMapStyles } from './styles/EnhancedMapPickerInput.styles';

type CircleLocation = {
  latitude: number;
  longitude: number;
  radius: number;
};

interface EnhancedMapPickerInputProps<T extends object> {
  name: Path<T>;
  label?: string;
  initialRegion?: Region;
  minRadius?: number;
  maxRadius?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const EnhancedMapPickerInput = <T extends object>({
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
}: EnhancedMapPickerInputProps<T>) => {
  const { control } = useFormContext<T>();
  const [region, setRegion] = useState<Region>(initialRegion);
  const [locating, setLocating] = useState(false);
  const theme = useAppTheme();
  const styles = createEnhancedMapStyles(theme);

  async function centerOnCurrentLocation(
    onChange: (coords: CircleLocation) => void,
    currentValue?: CircleLocation
  ) {
    setLocating(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocating(false);
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    onChange({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      radius: currentValue?.radius || 100,
    });
    setLocating(false);
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
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
                onPress={(e: MapPressEvent) => {
                  if (disabled) return;
                  const { latitude, longitude } = e.nativeEvent.coordinate;
                  onChange({
                    latitude,
                    longitude,
                    radius: circleLocation?.radius || 100,
                  });
                }}
                pointerEvents={disabled ? 'none' : 'auto'}
              >
                {circleLocation?.latitude && circleLocation?.longitude && (
                  <>
                    <Marker
                      coordinate={{
                        latitude: circleLocation.latitude,
                        longitude: circleLocation.longitude,
                      }}
                      image={require('@/assets/images/marker3.png')}
                    />

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

              {/* Botón de mi ubicación */}
              <View style={styles.topRightButton}>
                <TouchableOpacity
                  style={[styles.mapButton, locating && styles.mapButtonLoading]}
                  onPress={() => centerOnCurrentLocation(onChange, circleLocation)}
                  disabled={locating}
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

            {/* Información de coordenadas */}
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
