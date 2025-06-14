import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
import { useInvalidateTagsOnFocus } from '@/hooks/useInvalidateTagsOnFocus';
import { useIsOnline } from '@/hooks/useIsOnline';
import { createNookFormStyles } from '@/styles/app/modals/form.style';

import type { Tables } from '@/types/supabase';

type Realm = Tables<'locations'>;

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
        <View style={styles.sectionTextContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
        </View>
        {icon && (
          <View style={[styles.sectionIconContainer, { marginLeft: theme.spacing.s }]}>
            <Ionicons name={icon as any} size={18} color={theme.colors.primary} />
          </View>
        )}
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

export default function NookFormScreen({ initialValues, mode: modeProp }: NookFormProps) {
  const params = useLocalSearchParams<{ id?: string; realmId?: string; from?: string }>();
  const nookId = params.id as string | undefined;
  const realmId = params.realmId as string | undefined;
  const mode: 'create' | 'edit' = modeProp || (nookId ? 'edit' : 'create');
  const theme = useAppTheme();
  const { user } = useAuth();
  const { data: realms } = useRealmsQuery(user?.id || '');
  const [selectedRealm, setSelectedRealm] = useState<Realm | null>(null);
  const styles = createNookFormStyles(theme);
  const insets = useSafeAreaInsets();
  const createTagMutation = useCreateTagMutation();
  const { data: tags = [] } = useTagsQuery(user?.id || '');
  useInvalidateTagsOnFocus(user?.id || '');
  const isOnline = useIsOnline();

  const { data: nook, isLoading: isLoadingNook } = useNookQuery(nookId || '');
  const { data: nookTags = [], isLoading: isLoadingNookTags } = useLocationTagsQuery(nookId);
  const { data: primaryImageUrl } = useNookPrimaryImageUrl(nookId || '');

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });
  const [pendingNavigation, setPendingNavigation] = useState<null | (() => void)>(null);

  const methods = useForm<NookFormValues>({
    defaultValues: {
      name: nook?.name || initialValues?.name || '',
      description: nook?.description || initialValues?.description || '',
      location: {
        latitude: nook?.latitude ?? initialValues?.location?.latitude ?? 0,
        longitude: nook?.longitude ?? initialValues?.location?.longitude ?? 0,
      },
      realm_id: nook?.parent_location_id || initialValues?.realm_id || '',
      image: initialValues?.image || '',
      tags: nookTags || initialValues?.tags || [],
    },
    mode: 'onChange',
  });
  const { handleSubmit, setValue, watch, reset } = methods;
  const watchedValues = watch();

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
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

  useEffect(() => {
    if (mode === 'edit' && !isLoadingNookTags && nookTags) {
      setValue('tags', nookTags);
    }
  }, [mode, isLoadingNookTags, nookTags, setValue]);

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
    try {
      if (!isOnline) {
        setSnackbar({
          visible: true,
          message: 'No tienes conexión a internet. Por favor, conéctate e intenta nuevamente.',
          type: 'error',
        });
        return;
      }

      if (!user) {
        setSnackbar({
          visible: true,
          message: 'Usuario no autenticado',
          type: 'error',
        });
        return;
      }

      if (!selectedRealm || !data.location.latitude || !data.location.longitude) {
        setSnackbar({
          visible: true,
          message: 'Por favor, selecciona un realm y una ubicación en el mapa antes de continuar.',
          type: 'error',
        });
        return;
      }

      let nookResult: any;
      let imageChanged = false;
      let imageUploadSuccess = false;
      try {
        if (mode === 'edit' && nookId) {
          nookResult = await updateNookMutation.mutateAsync({
            id: nookId,
            data: {
              name: data.name,
              description: data.description,
              latitude: data.location.latitude,
              longitude: data.location.longitude,
              parent_location_id: selectedRealm.id,
              updated_at: new Date().toISOString(),
            },
          });
        } else {
          nookResult = await createNookMutation.mutateAsync({
            name: data.name,
            description: data.description,
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            parent_location_id: selectedRealm.id,
            user_id: user.id,
          });
        }

        if (nookResult && Array.isArray(data.tags)) {
          const selectedTags = data.tags || [];
          let currentTags: any[] = [];
          if (mode === 'edit' && nookTags) {
            currentTags = nookTags;
          }
          const tagsToAdd = selectedTags.filter(
            (tag: any) => !currentTags.some((t: any) => t.id === tag.id)
          );
          const tagsToRemove = currentTags.filter(
            (tag: any) => !selectedTags.some((t: any) => t.id === tag.id)
          );
          for (const tag of tagsToAdd) {
            await addTagToLocationMutation.mutateAsync({
              location_id: nookResult.id,
              tag_id: tag.id,
            });
          }
          for (const tag of tagsToRemove) {
            await removeTagFromLocationMutation.mutateAsync({
              location_id: nookResult.id,
              tag_id: tag.id,
            });
          }
        }

        if (data.image && nookResult && data.image !== primaryImageUrl) {
          imageChanged = true;
          try {
            await uploadMediaMutation.mutateAsync({
              userId: user.id,
              entityType: 'location',
              entityId: nookResult.id,
              localUri: data.image,
              isPrimary: true,
            });
            imageUploadSuccess = true;
          } catch (uploadError: any) {
            setSnackbar({
              visible: true,
              message:
                uploadError?.message ||
                (mode === 'edit'
                  ? 'Nook actualizado, pero falló la subida de la imagen'
                  : 'Nook creado, pero falló la subida de la imagen'),
              type: 'error',
            });
            setPendingNavigation(null);
            return;
          }
        }

        let message = '';
        if (imageChanged && imageUploadSuccess) {
          message = mode === 'edit' ? 'Nook e imagen actualizados' : 'Nook e imagen creados';
        } else {
          message = mode === 'edit' ? 'Nook actualizado' : 'Nook creado';
        }
        setSnackbar({
          visible: true,
          message,
          type: 'success',
        });
        setPendingNavigation(() => {
          if (mode === 'edit') {
            return () => router.replace(`/nooks/${nookResult.id}`);
          } else if (params.from === 'nook-selector') {
            return () =>
              router.replace({
                pathname: '/treasures/nook-selector',
                params: { realmId: selectedRealm.id },
              });
          } else {
            return () => router.replace(`/realms/${selectedRealm.id}`);
          }
        });
      } catch (nookError: any) {
        setSnackbar({
          visible: true,
          message:
            nookError?.message || `Error al ${mode === 'edit' ? 'actualizar' : 'crear'} el nook`,
          type: 'error',
        });
        setPendingNavigation(null);
        return;
      }
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: `Error inesperado: ${error.message}`,
        type: 'error',
      });
      setPendingNavigation(null);
    }
  };

  const handleRealmSelection = (realm: Realm) => {
    setSelectedRealm(realm);
    setValue('location', { latitude: 0, longitude: 0 });
  };
  const handleBackNavigation = () => {
    if (mode === 'edit' && nookId) {
      router.replace(`/nooks/${nookId}`);
    } else if (params.from === 'nook-selector' && realmId) {
      router.replace({
        pathname: '/treasures/nook-selector',
        params: { realmId },
      });
    } else if (selectedRealm) {
      router.replace(`/realms/${selectedRealm.id}`);
    } else {
      router.back();
    }
  };

  const handleChangeRealm = () => {
    setSelectedRealm(null);
    reset();
  };

  if (mode === 'edit' && isLoadingNook) {
    return null;
  }

  const loading =
    createNookMutation.isPending || updateNookMutation.isPending || uploadMediaMutation.isPending;
  return (
    <FormProvider {...methods}>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <CustomFormHeader
          title={mode === 'edit' ? 'Editar Nook' : 'Crear Nook'}
          onBack={handleBackNavigation}
        />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[styles.formContainer, { paddingBottom: 120 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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

              <FormSection
                title="Información Básica"
                subtitle="Dale un nombre único y atractivo a tu nook"
                icon="create-outline"
                styles={styles}
              >
                <View style={styles.inputSpacing}>
                  <ControlledTextInput
                    name="name"
                    label="Nombre del Nook"
                    placeholder="Ej: Mi rincón secreto"
                  />
                </View>
                <View style={styles.inputSpacingLast}>
                  <ControlledTextInput
                    name="description"
                    label="Descripción"
                    placeholder="Describe qué hace especial este nook..."
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </FormSection>

              <FormSection
                title="Imagen Representativa"
                subtitle="Una imagen que identifique a tu nook"
                icon="image-outline"
                styles={styles}
              >
                <ControlledImagePicker name="image" aspectRatio={16 / 9} />
              </FormSection>

              <FormSection
                title="Etiquetas"
                subtitle="Ayuda a encontrar tu nook con etiquetas descriptivas"
                icon="pricetag-outline"
                styles={styles}
              >
                {isLoadingNookTags && mode === 'edit' ? (
                  <View style={{ alignItems: 'center', padding: 16 }}>
                    <Text>Cargando etiquetas...</Text>
                  </View>
                ) : (
                  <TagSelector
                    name="tags"
                    options={tags}
                    loading={createTagMutation.isPending}
                    disabled={isLoadingNookTags && mode === 'edit'}
                    onSearchFocus={() => {
                      scrollViewRef.current?.scrollTo({ y: 3000, animated: true });
                    }}
                  />
                )}
              </FormSection>
            </>
          )}
        </ScrollView>

        <View
          style={[
            styles.floatingActionContainer,
            { paddingBottom: Math.max(insets.bottom, theme.spacing.s) },
          ]}
          pointerEvents="box-none"
        >
          <View style={styles.floatingActionInner}>
            {!isOnline && (
              <View style={styles.connectionWarning}>
                <Ionicons name="wifi-outline" size={20} color={theme.colors.onErrorContainer} />
                <Text style={styles.connectionWarningText}>Sin conexión a internet</Text>
              </View>
            )}
            <Button
              mode="contained"
              onPress={handleSubmit(handleSave)}
              loading={loading}
              disabled={
                loading ||
                !isOnline ||
                !watchedValues.name?.trim() ||
                !watchedValues.location?.latitude ||
                !watchedValues.location?.longitude ||
                !selectedRealm
              }
              style={styles.primaryButton}
            >
              {loading
                ? mode === 'edit'
                  ? 'Actualizando...'
                  : 'Creando...'
                : mode === 'edit'
                  ? 'Actualizar Nook'
                  : 'Crear Nook'}
            </Button>
            {mode === 'create' && !realmId && selectedRealm && (
              <Button
                mode="outlined"
                onPress={handleChangeRealm}
                disabled={loading}
                style={styles.secondaryButton}
              >
                Cambiar Realm
              </Button>
            )}
            <Button
              mode="outlined"
              onPress={handleBackNavigation}
              disabled={loading}
              style={styles.secondaryButton}
            >
              Cancelar
            </Button>
          </View>
        </View>

        <FeedbackSnackbar
          visible={snackbar.visible}
          onDismiss={() => {
            setSnackbar({ ...snackbar, visible: false });
            if (pendingNavigation) {
              pendingNavigation();
              setPendingNavigation(null);
            }
          }}
          message={snackbar.message}
          type={snackbar.type}
        />
      </SafeAreaView>
    </FormProvider>
  );
}
