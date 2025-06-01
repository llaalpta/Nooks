import * as Location from 'expo-location';
import React, { useState } from 'react';
import { useFormContext, Controller, Path } from 'react-hook-form';
import { View, StyleProp, ViewStyle } from 'react-native';
import MapView, { Marker, MapPressEvent, Region } from 'react-native-maps';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/MapPickerInput.styles';

type LatLng = { latitude: number; longitude: number };

interface MapPickerInputProps<T extends object> {
  name: Path<T>;
  label?: string;
  initialRegion?: Region;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const MapPickerInput = <T extends object>({
  name,
  label,
  initialRegion = {
    latitude: 40.4168, // Madrid por defecto
    longitude: -3.7038,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
  disabled,
  style,
}: MapPickerInputProps<T>) => {
  const { control } = useFormContext<T>();
  const [region, setRegion] = useState<Region>(initialRegion);
  const [locating, setLocating] = useState(false);
  const theme = useAppTheme();
  const styles = createStyles(theme);

  async function centerOnCurrentLocation(
    onChange: (coords: { latitude: number; longitude: number }) => void
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
    onChange({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    setLocating(false);
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const coords = value as LatLng | undefined;
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
                  onChange({ latitude, longitude });
                }}
                pointerEvents={disabled ? 'none' : 'auto'}
              >
                {coords?.latitude && coords?.longitude && (
                  <Marker coordinate={{ latitude: coords.latitude, longitude: coords.longitude }} />
                )}
              </MapView>
            </View>

            <Text style={styles.coordsText}>
              {coords?.latitude && coords?.longitude
                ? `Lat: ${coords.latitude.toFixed(5)}, Lng: ${coords.longitude.toFixed(5)}`
                : 'Toca el mapa para seleccionar ubicación'}
            </Text>

            <Button
              mode="outlined"
              onPress={() => centerOnCurrentLocation(onChange)}
              loading={locating}
              style={styles.button}
            >
              Usar mi ubicación
            </Button>

            {error && <Text style={styles.errorText}>{error?.message}</Text>}
          </View>
        );
      }}
    />
  );
};
