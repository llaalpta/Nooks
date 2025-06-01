import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { useFormContext, Controller, Path } from 'react-hook-form';
import { View, StyleProp, ViewStyle } from 'react-native';
import MapView, { Circle, MapPressEvent, Region } from 'react-native-maps';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/MapPickerInput.styles';

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
  minRadius = 50,
  maxRadius = 5000,
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
                style={{ flex: 1 }}
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
                  <Circle
                    center={{
                      latitude: circleLocation.latitude,
                      longitude: circleLocation.longitude,
                    }}
                    radius={circleLocation.radius}
                    fillColor="rgba(0, 122, 255, 0.2)"
                    strokeColor="rgba(0, 122, 255, 0.8)"
                    strokeWidth={2}
                  />
                )}
              </MapView>

              {/* Botón para centrar en ubicación actual */}
              <View style={styles.locationButtonContainer}>
                <Button
                  mode="contained"
                  onPress={() => centerOnCurrentLocation(onChange, circleLocation)}
                  loading={locating}
                  icon={<Ionicons name="locate" size={16} color={theme.colors.onPrimary} />}
                  style={styles.locationButton}
                >
                  Mi ubicación
                </Button>
              </View>
            </View>

            {/* Slider para ajustar el radio */}
            {circleLocation?.latitude && circleLocation?.longitude && (
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Radio: {circleLocation.radius.toFixed(0)}m</Text>
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
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderRangeLabel}>{minRadius}m</Text>
                  <Text style={styles.sliderRangeLabel}>{maxRadius}m</Text>
                </View>
              </View>
            )}

            <Text style={styles.coordsText}>
              {circleLocation?.latitude && circleLocation?.longitude
                ? `Lat: ${circleLocation.latitude.toFixed(5)}, Lng: ${circleLocation.longitude.toFixed(5)}, Radio: ${circleLocation.radius.toFixed(0)}m`
                : 'Toca el mapa para seleccionar área'}
            </Text>

            {error && <Text style={styles.errorText}>{error?.message}</Text>}
          </View>
        );
      }}
    />
  );
};
