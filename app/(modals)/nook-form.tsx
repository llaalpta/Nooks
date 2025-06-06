// Copiado desde app/modals/nook-form.tsx para que la ruta modal funcione correctamente
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { TextInput } from '@/components/atoms/TextInput';
import {
  PlatformMapView as MapView,
  PlatformMarker as Marker,
  PlatformCircle as Circle,
} from '@/components/common/PlatformMap';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useRealmsQuery } from '@/features/realms/hooks';

import type { Tables } from '@/types/supabase';

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
  const [selectedRealm, setSelectedRealm] = useState<Realm | null>(null);

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
  const [nookLocation, setNookLocation] = useState<{ latitude: number; longitude: number } | null>(
    initialValues?.latitude && initialValues?.longitude
      ? { latitude: initialValues.latitude, longitude: initialValues.longitude }
      : null
  );
  const [name, setName] = useState(initialValues?.name || '');
  const [description, setDescription] = useState(initialValues?.description || '');

  const isInsideCircle = (lat: number, lng: number, realm: Realm) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371000;
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
    } else {
      Alert.alert('Ubicación inválida', 'El nook debe estar dentro del círculo del realm.');
    }
  };

  const handleSave = () => {
    if (!selectedRealm || !nookLocation || !name) {
      Alert.alert('Completa todos los campos');
      return;
    }
    const values: NookFormValues = {
      name,
      description,
      latitude: nookLocation.latitude,
      longitude: nookLocation.longitude,
      realm_id: selectedRealm.id,
    };
    if (onSubmit) {
      onSubmit(values);
    } else {
      Alert.alert('Nook creado', `Nook "${name}" guardado en el realm "${selectedRealm.name}"`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        {!selectedRealm && mode === 'create' && !realmId ? (
          <>
            <Text variant="titleLarge">Selecciona un Realm</Text>
            {realms?.map((realm: Realm) => (
              <Button
                key={realm.id}
                onPress={() => setSelectedRealm(realm)}
                style={{ marginVertical: 8 }}
              >
                {realm.name}
              </Button>
            ))}
          </>
        ) : (
          <>
            <Text variant="titleLarge">Selecciona la ubicación del Nook</Text>
            <MapView
              style={{ height: 300, marginVertical: 16 }}
              region={
                selectedRealm
                  ? {
                      latitude: selectedRealm.latitude!,
                      longitude: selectedRealm.longitude!,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }
                  : undefined
              }
              onPress={handleMapPress}
              scrollEnabled={mode !== 'edit'}
              zoomEnabled={mode !== 'edit'}
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
              {nookLocation && <Marker coordinate={nookLocation} pinColor={theme.colors.primary} />}
            </MapView>
            <TextInput
              label="Nombre del Nook"
              value={name}
              onChangeText={setName}
              editable={mode !== 'edit'}
            />
            <TextInput
              label="Descripción"
              value={description}
              onChangeText={setDescription}
              multiline
              editable={mode !== 'edit'}
            />
            <Button
              onPress={handleSave}
              disabled={!nookLocation || !name || mode === 'edit'}
              style={{ marginTop: 16 }}
            >
              Guardar Nook
            </Button>
            {mode === 'create' && !realmId && (
              <Button
                onPress={() => {
                  setSelectedRealm(null);
                  setNookLocation(null);
                }}
                mode="outlined"
                style={{ marginTop: 8 }}
              >
                Cambiar Realm
              </Button>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
