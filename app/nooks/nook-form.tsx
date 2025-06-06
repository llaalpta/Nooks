import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import {
  PlatformMapView as MapView,
  PlatformMarker as Marker,
  PlatformCircle as Circle,
} from '@/components/common/PlatformMap';
import { ControlledImagePicker } from '@/components/forms/ControlledImagePicker';
import { ControlledTextInput } from '@/components/forms/ControlledTextInput';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useRealmsQuery } from '@/features/realms/hooks';
import { createStyles } from '@/styles/app/nook-form.style';
import darkMapStyle from '@/styles/app/tabs/map.style';

import type { Tables } from '@/types/supabase';
// Componente de sección visual reutilizable
const FormSection = ({
  children,
  title,
  subtitle,
  icon,
  styles,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  icon?: string;
  styles: any;
}) => {
  const theme = useAppTheme();
  return (
    <View style={styles.formSection}>
      <View style={styles.sectionHeader}>
        {icon && (
          <View style={styles.sectionIconContainer}>
            <Ionicons name={icon as any} size={18} color={theme.colors.primary} />
          </View>
        )}
        <View style={styles.sectionTextContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
};

// Puedes extender este tipo según los campos de tu tabla nooks
interface NookFormProps {
  initialValues?: Partial<NookFormValues>;
  mode?: 'create' | 'edit';
  onSubmit?: (values: NookFormValues) => void;
}

type Realm = Tables<'locations'>;

interface NookFormValues {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  realm_id: string;
}

export default function NookFormScreen({
  initialValues,
  mode = 'create',
  onSubmit,
}: NookFormProps) {
  const { realmId } = useLocalSearchParams();
  const theme = useAppTheme();
  const { user } = useAuth();
  const { data: realms } = useRealmsQuery(user?.id || '');
  // Selección automática de realm si viene por parámetro o initialValues
  const [selectedRealm, setSelectedRealm] = useState<Realm | null>(null);
  // Estado y ref para el mapa y región
  const mapRef = useRef<any>(null);
  const [region, setRegion] = useState<any>(undefined);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const styles = createStyles(theme);

  // Formulario controlado para inputs y validación
  const methods = useForm<NookFormValues>({
    defaultValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      latitude: initialValues?.latitude ?? undefined,
      longitude: initialValues?.longitude ?? undefined,
      realm_id: initialValues?.realm_id || '',
    },
    mode: 'onChange',
  });
  const { handleSubmit, setValue, watch } = methods;
  const watched = watch();

  // --- Lógica de zoom automático y botón "Usar mi ubicación" ---
  function getRegionForCircle(lat: number, lng: number, radius: number) {
    const latDelta = (radius / 1000 / 111.32) * 2.2;
    const lngDelta = (radius / 1000 / (111.32 * Math.cos((lat * Math.PI) / 180))) * 2.2;
    return {
      latitude: lat,
      longitude: lng,
      latitudeDelta: Math.max(latDelta, 0.01),
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  }

  useEffect(() => {
    if (
      selectedRealm &&
      selectedRealm.latitude &&
      selectedRealm.longitude &&
      selectedRealm.radius
    ) {
      const reg = getRegionForCircle(
        selectedRealm.latitude,
        selectedRealm.longitude,
        selectedRealm.radius
      );
      setRegion(reg);
      setTimeout(() => {
        mapRef.current?.animateToRegion(reg, 800);
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRealm?.id]);

  // Selección inicial de Realm (por param o initialValues)
  useEffect(() => {
    if (selectedRealm) return;
    if (initialValues?.realm_id && realms) {
      const found = realms.find((r) => r.id === initialValues.realm_id) || null;
      setSelectedRealm(found);
    } else if (realmId && realms) {
      const found = realms.find((r) => r.id === realmId) || null;
      setSelectedRealm(found);
    }
  }, [realms, initialValues?.realm_id, realmId, selectedRealm]);

  // Botón "Usar mi ubicación"
  async function handleUseMyLocation() {
    if (!selectedRealm) return;
    setIsLoadingLocation(true);
    try {
      const { status } = await import('expo-location').then((m) =>
        m.requestForegroundPermissionsAsync()
      );
      if (status !== 'granted') {
        Alert.alert(
          'Permiso requerido',
          'Activa los permisos de ubicación para usar esta función.'
        );
        setIsLoadingLocation(false);
        return;
      }
      const location = await import('expo-location').then((m) => m.getCurrentPositionAsync({}));
      const { latitude, longitude } = location.coords;
      const reg = getRegionForCircle(
        selectedRealm.latitude!,
        selectedRealm.longitude!,
        selectedRealm.radius!
      );
      setRegion(reg);
      mapRef.current?.animateToRegion(reg, 800);
      if (isInsideCircle(latitude, longitude, selectedRealm)) {
        setNookLocation({ latitude, longitude });
      } else {
        Alert.alert('Fuera del área', 'Tu ubicación actual está fuera del área del realm.');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener tu ubicación.');
    } finally {
      setIsLoadingLocation(false);
    }
  }

  // Mantener realm seleccionado sincronizado con params y realms
  React.useEffect(() => {
    if (selectedRealm) return;
    if (initialValues?.realm_id && realms) {
      const found = realms.find((r) => r.id === initialValues.realm_id) || null;
      setSelectedRealm(found);
    } else if (realmId && realms) {
      const found = realms.find((r) => r.id === realmId) || null;
      setSelectedRealm(found);
    }
  }, [realms, initialValues?.realm_id, realmId]);
  // Estado para la ubicación seleccionada
  const [nookLocation, setNookLocation] = useState<{ latitude: number; longitude: number } | null>(
    initialValues?.latitude && initialValues?.longitude
      ? { latitude: initialValues.latitude, longitude: initialValues.longitude }
      : null
  );

  // Comprobar si la ubicación está dentro del círculo del realm
  const isInsideCircle = (lat: number, lng: number, realm: Realm) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371000; // radio de la tierra en metros
    const dLat = toRad(lat - realm.latitude!);
    const dLng = toRad(lng - realm.longitude!);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(realm.latitude!)) *
        Math.cos(toRad(lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance <= (realm.radius || 0);
  };

  const handleMapPress = (e: any) => {
    if (!selectedRealm || mode === 'edit') return;
    const { latitude, longitude } = e.nativeEvent.coordinate;
    if (isInsideCircle(latitude, longitude, selectedRealm)) {
      setNookLocation({ latitude, longitude });
      setValue('latitude', latitude);
      setValue('longitude', longitude);
    } else {
      Alert.alert('Ubicación inválida', 'El nook debe estar dentro del círculo del realm.');
    }
  };

  const handleSave = (data: NookFormValues) => {
    if (!selectedRealm || !data.latitude || !data.longitude || !data.name) {
      Alert.alert('Completa todos los campos');
      return;
    }
    const values: NookFormValues = {
      ...data,
      realm_id: selectedRealm.id,
    };
    if (onSubmit) {
      onSubmit(values);
    } else {
      Alert.alert(
        'Nook creado',
        `Nook "${data.name}" guardado en el realm "${selectedRealm.name}"`
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          {/* Selector de realm */}
          {!selectedRealm && mode === 'create' && !realmId ? (
            <FormSection
              title="Selecciona un Realm"
              subtitle="Elige el realm donde quieres crear el nook"
              icon="earth"
              styles={styles}
            >
              {realms?.map((realm: Realm) => (
                <Button
                  key={realm.id}
                  onPress={() => setSelectedRealm(realm)}
                  style={styles.realmButton}
                  mode="outlined"
                >
                  {realm.name}
                </Button>
              ))}
            </FormSection>
          ) : (
            <>
              {/* Sección: Ubicación y mapa */}
              <FormSection
                title="Ubicación del Nook"
                subtitle="Elige la ubicación exacta dentro del área del realm"
                icon="location-outline"
                styles={styles}
              >
                <View style={styles.mapSection}>
                  <MapView
                    ref={mapRef}
                    style={styles.map}
                    region={region}
                    onRegionChangeComplete={setRegion}
                    onPress={handleMapPress}
                    scrollEnabled={mode !== 'edit'}
                    zoomEnabled={mode !== 'edit'}
                    customMapStyle={theme.dark ? darkMapStyle : undefined}
                  >
                    {selectedRealm && (
                      <Circle
                        center={{
                          latitude: selectedRealm.latitude!,
                          longitude: selectedRealm.longitude!,
                        }}
                        radius={selectedRealm.radius || 0}
                        fillColor={`${theme.colors.primary}22`}
                        strokeColor={theme.colors.primary}
                        strokeWidth={2}
                      />
                    )}
                    {nookLocation && (
                      <Marker coordinate={nookLocation} pinColor={theme.colors.primary} />
                    )}
                  </MapView>
                  {/* Botón "Usar mi ubicación" */}
                  <View style={styles.mapButtonContainer}>
                    <TouchableOpacity
                      style={[styles.mapButton, isLoadingLocation && styles.loadingButton]}
                      onPress={handleUseMyLocation}
                      disabled={isLoadingLocation || mode === 'edit'}
                    >
                      {isLoadingLocation ? (
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
                  {/* Indicativo de tocar el mapa */}
                  <View style={styles.coordsContainer}>
                    <Text style={styles.coordsText}>
                      {nookLocation
                        ? `📍 Lat: ${nookLocation.latitude.toFixed(5)}, Lng: ${nookLocation.longitude.toFixed(5)}`
                        : '👆 Toca el mapa para seleccionar ubicación'}
                    </Text>
                  </View>
                </View>
              </FormSection>

              {/* Sección: Información básica */}
              <FormSection
                title="Información básica"
                subtitle="Ponle un nombre y una descripción a tu nook"
                icon="create-outline"
                styles={styles}
              >
                <ControlledTextInput
                  name="name"
                  label="Nombre del Nook"
                  placeholder="Ej: Mi rincón secreto"
                  editable={mode !== 'edit'}
                />
                <ControlledTextInput
                  name="description"
                  label="Descripción"
                  placeholder="Describe qué hace especial este nook..."
                  multiline
                  numberOfLines={3}
                  editable={mode !== 'edit'}
                  style={{ marginTop: 12 }}
                />
              </FormSection>

              {/* Sección: Imagen */}
              <FormSection
                title="Imagen representativa"
                subtitle="Una imagen ayuda a identificar tu nook"
                icon="image-outline"
                styles={styles}
              >
                <ControlledImagePicker name="image" />
              </FormSection>

              {/* Sección: Etiquetas (opcional, solo si tienes lógica de tags para nooks) */}
              {/*
              <FormSection
                title="Etiquetas"
                subtitle="Ayuda a otros a encontrar tu nook con etiquetas descriptivas"
                icon="pricetag-outline"
                styles={styles}
              >
                <TagSelector
                  name="tags"
                  options={[]}
                  loading={false}
                  onCreateTag={async () => null}
                />
              </FormSection>
              */}

              {/* Botones de acción */}
              <View style={styles.actionContainer}>
                <Button
                  mode="contained"
                  onPress={handleSubmit((data) => handleSave(data as NookFormValues))}
                  disabled={mode === 'edit' || !watched.name?.trim() || !nookLocation}
                  style={styles.primaryButton}
                >
                  Guardar Nook
                </Button>
                {mode === 'create' && !realmId && (
                  <Button
                    onPress={() => {
                      setSelectedRealm(null);
                      setNookLocation(null);
                      setValue('latitude', 0);
                      setValue('longitude', 0);
                    }}
                    mode="outlined"
                    style={styles.secondaryButton}
                  >
                    Cambiar Realm
                  </Button>
                )}
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </FormProvider>
  );
}
