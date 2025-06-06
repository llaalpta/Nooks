import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { CustomFormHeader } from '@/components/common/CustomFormHeader';
import { BasicMapPickerInput } from '@/components/forms/BasicaMapPickerInput';
import { ControlledImagePicker } from '@/components/forms/ControlledImagePicker';
import { ControlledTextInput } from '@/components/forms/ControlledTextInput';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useRealmsQuery } from '@/features/realms/hooks';
import { createNookFormStyles } from '@/styles/app/modals/form.style';

import type { Tables } from '@/types/supabase';

type Realm = Tables<'locations'>;

// Componente de sección visual reutilizable (igual que en realm-form)
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

interface NookFormProps {
  initialValues?: Partial<NookFormValues>;
  mode?: 'create' | 'edit';
  onSubmit?: (values: NookFormValues) => void;
}

interface NookFormValues {
  name: string;
  description: string;
  location: { latitude: number; longitude: number };
  realm_id: string;
  image?: string;
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
  const styles = createNookFormStyles(theme);

  // Formulario controlado
  const methods = useForm<NookFormValues>({
    defaultValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      location: {
        latitude: initialValues?.location?.latitude || 0,
        longitude: initialValues?.location?.longitude || 0,
      },
      realm_id: initialValues?.realm_id || '',
      image: initialValues?.image || '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, setValue, watch, reset } = methods;
  const watched = watch();

  // Selección inicial de Realm
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

  // Actualizar realm_id en el formulario cuando se selecciona un realm
  useEffect(() => {
    if (selectedRealm) {
      setValue('realm_id', selectedRealm.id);
    }
  }, [selectedRealm, setValue]);

  const handleSave = (data: NookFormValues) => {
    if (!selectedRealm || !data.location.latitude || !data.location.longitude || !data.name) {
      Alert.alert(
        'Completa todos los campos',
        'Asegúrate de seleccionar un realm, ubicación y nombre.'
      );
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

  const handleRealmSelection = (realm: Realm) => {
    setSelectedRealm(realm);
    // Reset ubicación cuando cambia el realm
    setValue('location', { latitude: 0, longitude: 0 });
  };

  const handleBackNavigation = () => {
    if (selectedRealm) {
      router.replace(`/realms/${selectedRealm.id}`);
    } else {
      router.back();
    }
  };

  return (
    <FormProvider {...methods}>
      <SafeAreaView style={styles.container}>
        {/* Header unificado */}
        <CustomFormHeader
          title={mode === 'edit' ? 'Editar Nook' : 'Crear Nook'}
          onBack={handleBackNavigation}
        />

        <ScrollView
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
                  onPress={() => handleRealmSelection(realm)}
                  style={styles.realmButton}
                  mode="outlined"
                >
                  {realm.name}
                </Button>
              ))}
            </FormSection>
          ) : (
            <>
              {/* Sección: Ubicación del Nook */}
              <FormSection
                title="Ubicación del Nook"
                subtitle="Elige la ubicación exacta dentro del área del realm"
                icon="location-outline"
                styles={styles}
              >
                <BasicMapPickerInput
                  name="location"
                  label="Selecciona ubicación en el mapa"
                  disabled={mode === 'edit'}
                  realmCenter={
                    selectedRealm?.latitude && selectedRealm?.longitude
                      ? {
                          latitude: selectedRealm.latitude,
                          longitude: selectedRealm.longitude,
                        }
                      : undefined
                  }
                  realmRadius={selectedRealm?.radius || undefined}
                  initialRegion={
                    selectedRealm?.latitude && selectedRealm?.longitude
                      ? {
                          latitude: selectedRealm.latitude,
                          longitude: selectedRealm.longitude,
                          latitudeDelta: Math.max(
                            ((selectedRealm.radius || 100) / 1000 / 111.32) * 2.2,
                            0.01
                          ),
                          longitudeDelta: Math.max(
                            ((selectedRealm.radius || 100) /
                              1000 /
                              (111.32 * Math.cos((selectedRealm.latitude * Math.PI) / 180))) *
                              2.2,
                            0.01
                          ),
                        }
                      : undefined
                  }
                />
              </FormSection>

              {/* Sección: Información básica */}
              <FormSection
                title="Información Básica"
                subtitle="Ponle un nombre y una descripción a tu nook"
                icon="create-outline"
                styles={styles}
              >
                <View style={styles.inputSpacing}>
                  <ControlledTextInput
                    name="name"
                    label="Nombre del Nook"
                    placeholder="Ej: Mi rincón secreto"
                    editable={mode !== 'edit'}
                  />
                </View>
                <View style={styles.inputSpacingLast}>
                  <ControlledTextInput
                    name="description"
                    label="Descripción"
                    placeholder="Describe qué hace especial este nook..."
                    multiline
                    numberOfLines={3}
                    editable={mode !== 'edit'}
                  />
                </View>
              </FormSection>

              {/* Sección: Imagen representativa */}
              <FormSection
                title="Imagen Representativa"
                subtitle="Una imagen ayuda a identificar tu nook"
                icon="image-outline"
                styles={styles}
              >
                <ControlledImagePicker name="image" />
              </FormSection>

              {/* Botones de acción */}
              <View style={styles.actionContainer}>
                <Button
                  mode="contained"
                  onPress={handleSubmit(handleSave)}
                  disabled={
                    mode === 'edit' ||
                    !watched.name?.trim() ||
                    !watched.location?.latitude ||
                    !watched.location?.longitude
                  }
                  style={styles.primaryButton}
                >
                  {mode === 'edit' ? 'Actualizar Nook' : 'Crear Nook'}
                </Button>

                {mode === 'create' && !realmId && (
                  <Button
                    onPress={() => {
                      setSelectedRealm(null);
                      reset();
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
        </ScrollView>
      </SafeAreaView>
    </FormProvider>
  );
}
