// components/forms/BasicMapPickerInput.tsx
// Componente de mapa básico sin controles de radio para nook-form

import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { useFormContext, Controller, Path } from 'react-hook-form';
import { View, StyleProp, ViewStyle, TouchableOpacity, ActivityIndicator } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { FeedbackSnackbar } from '@/components/common/FeedbackSnackbar';
import {
  PlatformMapView as MapView,
  PlatformMarker as Marker,
  PlatformCircle as Circle,
  Region,
} from '@/components/common/PlatformMap';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useLocationService } from '@/hooks/useLocationService';
import { useMapMarkers } from '@/hooks/useMapMarkers';
import darkMapStyle from '@/styles/app/tabs/map.style';

import { createBasicMapPickerStyles } from './styles/BasicMapPickerInput.styles';

type BasicLocation = {
  latitude: number;
  longitude: number;
};

interface BasicMapPickerInputProps<T extends object> {
  name: Path<T>;
  label?: string;
  initialRegion?: Region;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  // Props específicos para nook (validación dentro de área)
  realmCenter?: { latitude: number; longitude: number };
  realmRadius?: number;
  onLocationValidation?: (isValid: boolean, location: BasicLocation) => void;
}

export const BasicMapPickerInput = <T extends object>({
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
  realmCenter,
  realmRadius,
  onLocationValidation,
}: BasicMapPickerInputProps<T>) => {
  const { control } = useFormContext<T>();

  // Calcular región inicial basada en el realm (igual que en MapScreen)
  const getInitialRegion = () => {
    if (realmCenter && realmRadius) {
      // Misma lógica que handleRealmPress en MapScreen
      return {
        latitude: realmCenter.latitude,
        longitude: realmCenter.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    return initialRegion;
  };

  const [region, setRegion] = useState<Region>(getInitialRegion());
  const mapRef = useRef<any>(null);
  const theme = useAppTheme();
  const styles = createBasicMapPickerStyles(theme);

  // Usar hooks unificados: para Nook, usar el marcador pequeño de Nook
  const { handleMapReady: originalHandleMapReady, getMarkerProps } = useMapMarkers({
    imagePath: '@/assets/images/nook-marker-small.png',
  });

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'error' as 'error' | 'success' | 'info',
  });
  const { isLocating, getCurrentLocation, isLocationInArea } = useLocationService({
    onLocationObtained: (coords) => {
      if (!realmCenter || !realmRadius || isLocationInArea(coords, realmCenter, realmRadius)) {
        const newRegion = {
          ...coords,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta,
        };
        setRegion(newRegion);
      }
    },
    onLocationError: (msg) => setSnackbar({ visible: true, message: msg, type: 'error' }),
    validateArea:
      realmCenter && realmRadius
        ? (coords) => isLocationInArea(coords, realmCenter, realmRadius)
        : undefined,
    areaValidationMessage: 'Tu ubicación actual está fuera del área del realm.',
  });

  // Actualizar región cuando cambie el realm (igual que en MapScreen)
  useEffect(() => {
    if (realmCenter && realmRadius) {
      const newRegion = {
        latitude: realmCenter.latitude,
        longitude: realmCenter.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
    }
  }, [realmCenter?.latitude, realmCenter?.longitude, realmRadius]);

  const centerOnCurrentLocation = async (onChange: (coords: BasicLocation) => void) => {
    const location = await getCurrentLocation();
    if (location) {
      onChange(location);

      // Notificar validación si se proporciona callback
      if (onLocationValidation && realmCenter && realmRadius) {
        const isValid = isLocationInArea(location, realmCenter, realmRadius);
        onLocationValidation(isValid, location);
      }
    }
  };

  const centerOnRealm = () => {
    if (realmCenter) {
      // Calcular delta en grados para que el círculo quepa bien en pantalla
      // 1 grado de latitud ≈ 111.32 km
      // 1 grado de longitud ≈ 111.32 * cos(lat) km
      const radius = realmRadius || 100; // metros
      const MIN_DELTA = 0.0001; // Permitir zoom muy cercano para círculos pequeños
      const latDelta = Math.max((radius / 1000 / 111.32) * 2.2, MIN_DELTA); // 2.2x para padding visual
      const lngDelta = Math.max(
        (radius / 1000 / (111.32 * Math.cos((realmCenter.latitude * Math.PI) / 180))) * 2.2,
        MIN_DELTA
      );
      const realmRegion = {
        latitude: realmCenter.latitude,
        longitude: realmCenter.longitude,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      };
      if (mapRef.current && mapRef.current.animateToRegion) {
        mapRef.current.animateToRegion(realmRegion, 800);
      }
    }
  };

  // Hacer zoom automáticamente al abrir el formulario si hay realmCenter y realmRadius SOLO una vez cuando el mapa esté listo
  const hasAutoCentered = useRef(false);
  const handleMapReady = React.useCallback(() => {
    if (
      !hasAutoCentered.current &&
      realmCenter &&
      realmRadius &&
      mapRef.current &&
      mapRef.current.animateToRegion
    ) {
      const radius = realmRadius;
      const MIN_DELTA = 0.0001;
      const latDelta = Math.max((radius / 1000 / 111.32) * 2.2, MIN_DELTA);
      const lngDelta = Math.max(
        (radius / 1000 / (111.32 * Math.cos((realmCenter.latitude * Math.PI) / 180))) * 2.2,
        MIN_DELTA
      );
      const realmRegion = {
        latitude: realmCenter.latitude,
        longitude: realmCenter.longitude,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      };
      mapRef.current.animateToRegion(realmRegion, 800);
      hasAutoCentered.current = true;
    }
    // Llamar también al handleMapReady original si existe
    if (typeof originalHandleMapReady === 'function') {
      originalHandleMapReady();
    }
  }, [realmCenter, realmRadius, originalHandleMapReady]);
  // El log debe ir dentro del render del Controller
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const fieldLocation = value as BasicLocation | undefined;
        // LOG para detectar renders infinitos

        return (
          <View style={[styles.container, style]}>
            <FeedbackSnackbar
              visible={snackbar.visible}
              onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
              message={snackbar.message}
              type={snackbar.type}
            />
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={styles.mapContainer}>
              {/* Filtrar children para evitar null, false, undefined o strings en MapView */}
              <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                initialRegion={region}
                onMapReady={handleMapReady}
                onPress={(e: any) => {
                  if (disabled) return;
                  const { latitude, longitude } = e.nativeEvent.coordinate;

                  // Validar ubicación si hay restricciones
                  if (realmCenter && realmRadius) {
                    const isValid = isLocationInArea(
                      { latitude, longitude },
                      realmCenter,
                      realmRadius
                    );

                    if (!isValid) {
                      setSnackbar({
                        visible: true,
                        message: 'La ubicación debe estar dentro del área del realm.',
                        type: 'error',
                      });
                      return;
                    }
                    // Notificar validación
                    if (onLocationValidation) {
                      onLocationValidation(isValid, { latitude, longitude });
                    }
                  }

                  onChange({ latitude, longitude });
                }}
                pointerEvents={disabled ? 'none' : 'auto'}
                customMapStyle={theme.dark ? darkMapStyle : undefined}
                showsUserLocation={false}
                showsMyLocationButton={false}
                showsCompass={false}
                showsScale={false}
                showsBuildings={false}
                showsTraffic={false}
                showsIndoors={true}
                rotateEnabled={true}
                scrollEnabled={true}
                pitchEnabled={true}
                zoomEnabled={true}
                toolbarEnabled={false}
              >
                {[
                  realmCenter && realmRadius ? (
                    <Circle
                      key="circle"
                      center={realmCenter}
                      radius={realmRadius}
                      fillColor={`${theme.colors.primary}22`}
                      strokeColor={theme.colors.primary}
                      strokeWidth={2}
                    />
                  ) : null,
                  fieldLocation?.latitude && fieldLocation?.longitude ? (
                    <Marker
                      key="marker"
                      coordinate={{
                        latitude: fieldLocation.latitude,
                        longitude: fieldLocation.longitude,
                      }}
                      {...getMarkerProps()}
                    />
                  ) : null,
                ].filter(Boolean)}
              </MapView>

              {/* Botón de centrar realm: esquina superior izquierda */}
              {realmCenter && (
                <View style={styles.topLeftButton}>
                  <TouchableOpacity
                    style={[styles.mapButton]}
                    onPress={centerOnRealm}
                    disabled={disabled}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="business" size={16} color={theme.colors.onPrimary} />
                      <Text style={styles.mapButtonText}>CENTRAR REALM</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              {/* Botón de mi ubicación: esquina superior derecha */}
              <View style={styles.topRightButton}>
                <TouchableOpacity
                  style={[styles.mapButton, isLocating && styles.mapButtonLoading]}
                  onPress={() => centerOnCurrentLocation(onChange)}
                  disabled={isLocating || disabled}
                >
                  {isLocating ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <ActivityIndicator size={16} color={theme.colors.onPrimary} />
                      <Text style={styles.mapButtonText}>BUSCANDO...</Text>
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="locate" size={16} color={theme.colors.onPrimary} />
                      <Text style={styles.mapButtonText}>MI UBICACIÓN</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Información de coordenadas */}
            <View style={styles.infoContainer}>
              <Text style={styles.coordsText}>
                {fieldLocation?.latitude && fieldLocation?.longitude
                  ? `📍 Lat: ${fieldLocation.latitude.toFixed(5)}, Lng: ${fieldLocation.longitude.toFixed(5)}`
                  : '👆 Toca el mapa para seleccionar ubicación'}
              </Text>
            </View>

            {error && error.message && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
        );
      }}
    />
  );
};
