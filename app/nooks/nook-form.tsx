import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { CustomFormHeader } from '@/components/common/CustomFormHeader';
import { FeedbackSnackbar } from '@/components/common/FeedbackSnackbar';
import { BasicMapPickerInput } from '@/components/forms/BasicaMapPickerInput';
import { ControlledImagePicker } from '@/components/forms/ControlledImagePicker';
import { ControlledTextInput } from '@/components/forms/ControlledTextInput';
import { TagSelector } from '@/components/forms/TagSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useUploadMediaMutation } from '@/features/media/hooks';
import {
  useCreateNookMutation,
  useUpdateNookMutation,
  useNookQuery,
  useNookPrimaryImageUrl,
} from '@/features/nooks/hooks';
import { useRealmsQuery } from '@/features/realms/hooks';
import {
  useTagsQuery,
  useCreateTagMutation,
  useAddTagToLocationMutation,
  useRemoveTagFromLocationMutation,
  useLocationTagsQuery,
} from '@/features/tags/hooks';
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
  tags: any[];
}

// 'onSubmit' no se usa, así que lo quitamos para evitar warning de compilación
export default function NookFormScreen({ initialValues, mode: modeProp }: NookFormProps) {
  // Leer params de la ruta
  const params = useLocalSearchParams<{ id?: string; realmId?: string; from?: string }>();
  const nookId = params.id as string | undefined;
  const realmId = params.realmId as string | undefined;
  // Determinar modo
  const mode: 'create' | 'edit' = modeProp || (nookId ? 'edit' : 'create');
  const theme = useAppTheme();
  const { user } = useAuth();
  const { data: realms } = useRealmsQuery(user?.id || '');
  const [selectedRealm, setSelectedRealm] = useState<Realm | null>(null);
  const styles = createNookFormStyles(theme);
  const createTagMutation = useCreateTagMutation();
  const { data: tags = [] } = useTagsQuery(user?.id || '');

  // Cargar datos del nook si es edición
  const { data: nook, isLoading: isLoadingNook } = useNookQuery(nookId || '');
  // Cargar tags asociados al nook en edición
  const { data: nookTags = [], isLoading: isLoadingNookTags } = useLocationTagsQuery(nookId);
  // Precargar imagen principal en modo edición
  const { data: primaryImageUrl } = useNookPrimaryImageUrl(nookId || '');

  // Estado para Snackbar
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  // Formulario controlado

  // Prefill para edición
  const methods = useForm<NookFormValues>({
    defaultValues: {
      name: nook?.name || initialValues?.name || '',
      description: nook?.description || initialValues?.description || '',
      location: {
        latitude: nook?.latitude ?? initialValues?.location?.latitude ?? 0,
        longitude: nook?.longitude ?? initialValues?.location?.longitude ?? 0,
      },
      realm_id: nook?.parent_location_id || initialValues?.realm_id || '',
      image: initialValues?.image || '', // Se actualizará abajo si es edición
      tags: nookTags || initialValues?.tags || [],
    },
    mode: 'onChange',
  });
  const { handleSubmit, setValue, watch, reset } = methods;
  const watched = watch();

  // Si es edición, setear los valores cuando nook esté disponible
  React.useEffect(() => {
    if (mode === 'edit' && nook && !isLoadingNookTags) {
      try {
        reset({
          name: nook.name || '',
          description: nook.description || '',
          location: {
            latitude: nook.latitude ?? 0,
            longitude: nook.longitude ?? 0,
          },
          realm_id: nook.parent_location_id || '',
          image: primaryImageUrl || '',
          tags: nookTags || [],
        });
      } catch {
        setSnackbar({
          visible: true,
          message: 'Error al cargar las etiquetas del nook.',
          type: 'error',
        });
      }
    }
  }, [mode, nook, nookTags, isLoadingNookTags, reset, primaryImageUrl]);

  // Forzar la precarga de tags en edición cuando nookTags cambian
  React.useEffect(() => {
    if (mode === 'edit' && !isLoadingNookTags && nookTags) {
      // console.log('[NookForm] setValue tags:', nookTags);
      setValue('tags', nookTags);
    }
  }, [mode, isLoadingNookTags, nookTags, setValue]);

  // Selección inicial de Realm (creación y edición)
  useEffect(() => {
    if (selectedRealm) return;
    // Prioridad: edición con nook cargado > initialValues > realmId
    if (mode === 'edit' && nook && realms) {
      const found = realms.find((r) => r.id === nook.parent_location_id) || null;
      setSelectedRealm(found);
    } else if (initialValues?.realm_id && realms) {
      const found = realms.find((r) => r.id === initialValues.realm_id) || null;
      setSelectedRealm(found);
    } else if (realmId && realms) {
      const found = realms.find((r) => r.id === realmId) || null;
      setSelectedRealm(found);
    }
  }, [realms, initialValues?.realm_id, realmId, selectedRealm, mode, nook]);

  // Actualizar realm_id en el formulario cuando se selecciona un realm
  useEffect(() => {
    if (selectedRealm) {
      setValue('realm_id', selectedRealm.id);
    }
  }, [selectedRealm, setValue]);

  const createNookMutation = useCreateNookMutation();
  const updateNookMutation = useUpdateNookMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  const addTagToLocationMutation = useAddTagToLocationMutation();
  const removeTagFromLocationMutation = useRemoveTagFromLocationMutation();

  const handleSave = async (data: NookFormValues) => {
    if (!selectedRealm || !data.location.latitude || !data.location.longitude || !data.name) {
      setSnackbar({
        visible: true,
        message: 'Asegúrate de seleccionar un realm, ubicación y nombre.',
        type: 'error',
      });
      return;
    }

    if (!user) {
      setSnackbar({
        visible: true,
        message: 'Debes iniciar sesión para guardar el nook.',
        type: 'error',
      });
      return;
    }

    try {
      let nookResult;
      if (mode === 'edit' && nookId) {
        // Actualizar nook
        nookResult = await updateNookMutation.mutateAsync({
          id: nookId,
          data: {
            name: data.name,
            description: data.description,
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            parent_location_id: selectedRealm.id,
          },
        });
      } else {
        // Crear nook
        nookResult = await createNookMutation.mutateAsync({
          name: data.name,
          description: data.description,
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          parent_location_id: selectedRealm.id,
          user_id: user.id,
        });
      }

      // Sincronizar tags
      const selectedTags = data.tags || [];
      let currentTags: any[] = [];
      if (mode === 'edit' && nookTags) {
        currentTags = nookTags;
      }
      // Calcular tags a añadir y eliminar
      const tagsToAdd = selectedTags.filter(
        (tag: any) => !currentTags.some((t: any) => t.id === tag.id)
      );
      const tagsToRemove = currentTags.filter(
        (tag: any) => !selectedTags.some((t: any) => t.id === tag.id)
      );
      // Añadir nuevos tags
      for (const tag of tagsToAdd) {
        await addTagToLocationMutation.mutateAsync({
          location_id: nookResult.id,
          tag_id: tag.id,
        });
      }
      // Eliminar tags desasociados
      for (const tag of tagsToRemove) {
        await removeTagFromLocationMutation.mutateAsync({
          location_id: nookResult.id,
          tag_id: tag.id,
        });
      }

      // Subir imagen si existe
      let imageSuccess = false;
      if (data.image) {
        try {
          await uploadMediaMutation.mutateAsync({
            userId: user.id,
            entityType: 'location',
            entityId: nookResult.id,
            localUri: data.image,
            isPrimary: true,
          });
          imageSuccess = true;
        } catch {
          setSnackbar({
            visible: true,
            message: `${mode === 'edit' ? 'Nook actualizado' : 'Nook creado'}, pero la imagen no se pudo subir`,
            type: 'warning',
          });
        }
      }

      // Mensaje de éxito principal
      setSnackbar({
        visible: true,
        message:
          mode === 'edit'
            ? imageSuccess
              ? 'Nook e imagen actualizados con éxito'
              : 'Nook actualizado con éxito'
            : imageSuccess
              ? 'Nook e imagen creados con éxito'
              : 'Nook creado con éxito',
        type: 'success',
      });
      setTimeout(() => {
        if (mode === 'edit') {
          router.replace(`/nooks/${nookResult.id}`);
        } else {
          router.replace(`/realms/${selectedRealm.id}`);
        }
      }, 1800);
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error?.message || `No se pudo ${mode === 'edit' ? 'actualizar' : 'crear'} el nook`,
        type: 'error',
      });
    }
  };

  const handleRealmSelection = (realm: Realm) => {
    setSelectedRealm(realm);
    // Reset ubicación cuando cambia el realm
    setValue('location', { latitude: 0, longitude: 0 });
  };

  const handleBackNavigation = () => {
    if (mode === 'edit' && nookId) {
      router.replace(`/nooks/${nookId}`);
    } else if (selectedRealm) {
      router.replace(`/realms/${selectedRealm.id}`);
    } else {
      router.back();
    }
  };

  if (mode === 'edit' && isLoadingNook) {
    return null;
  }

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
                subtitle={mode === 'edit' ? '' : 'Selecciona la ubicación en el mapa'}
                icon="location-outline"
                styles={styles}
              >
                <BasicMapPickerInput
                  name="location"
                  label={
                    mode === 'edit'
                      ? 'No se puede editar la ubicación en el mapa'
                      : 'Selecciona ubicación en el mapa'
                  }
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
                subtitle={
                  mode === 'edit'
                    ? 'Modifica el nombre y descripción de tu nook'
                    : 'Ponle un nombre y una descripción a tu nook'
                }
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

              {/* Sección: Etiquetas */}
              <FormSection
                title="Etiquetas"
                subtitle="Ayuda a otros a encontrar tu nook con etiquetas descriptivas"
                icon="pricetag-outline"
                styles={styles}
              >
                {isLoadingNookTags && mode === 'edit' ? (
                  <View style={{ alignItems: 'center', padding: 16 }}>
                    <Text>Cargando etiquetas...</Text>
                  </View>
                ) : (
                  <>
                    {/* console.log('[NookForm] render TagSelector, tags en form:', watched.tags) */}
                    <TagSelector
                      name="tags"
                      label="Etiquetas"
                      options={tags}
                      loading={createTagMutation.isPending}
                      disabled={isLoadingNookTags && mode === 'edit'}
                      onCreateTag={async (name, color) => {
                        if (!user?.id) return null;
                        try {
                          const result = await createTagMutation.mutateAsync({
                            name,
                            color,
                            user_id: user.id,
                          });
                          return result as any;
                        } catch {
                          return null;
                        }
                      }}
                    />
                  </>
                )}
              </FormSection>

              {/* Botones de acción */}
              <View style={styles.actionContainer}>
                <Button
                  mode="contained"
                  onPress={handleSubmit(handleSave)}
                  disabled={
                    (mode === 'edit'
                      ? updateNookMutation.isPending
                      : createNookMutation.isPending) ||
                    !watched.name?.trim() ||
                    !watched.location?.latitude ||
                    !watched.location?.longitude
                  }
                  loading={
                    mode === 'edit' ? updateNookMutation.isPending : createNookMutation.isPending
                  }
                  style={styles.primaryButton}
                >
                  {mode === 'edit'
                    ? updateNookMutation.isPending
                      ? 'Actualizando...'
                      : 'Actualizar Nook'
                    : createNookMutation.isPending
                      ? 'Creando...'
                      : 'Crear Nook'}
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
        <FeedbackSnackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
          message={snackbar.message}
          type={snackbar.type}
        />
      </SafeAreaView>
    </FormProvider>
  );
}
