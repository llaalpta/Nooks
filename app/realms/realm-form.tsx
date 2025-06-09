import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { CustomFormHeader } from '@/components/common/CustomFormHeader';
import { FeedbackSnackbar } from '@/components/common/FeedbackSnackbar';
import LoadingScreen from '@/components/common/LoadingScreen';
import { CircleMapPickerInput } from '@/components/forms/CircleMapPickerInput';
import { ControlledImagePicker } from '@/components/forms/ControlledImagePicker';
import { ControlledTextInput } from '@/components/forms/ControlledTextInput';
import { TagSelector } from '@/components/forms/TagSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useUploadMediaMutation } from '@/features/media/hooks';
import { setTagsForRealm } from '@/features/realms/api';
import {
  useRealmQuery,
  useUpdateRealmMutation,
  useCreateRealmMutation,
  useRealmPrimaryImageUrl,
} from '@/features/realms/hooks';
import { useTagsQuery, useCreateTagMutation, useLocationTagsQuery } from '@/features/tags/hooks';
import { useInvalidateTagsOnFocus } from '@/hooks/useInvalidateTagsOnFocus';
import { useIsOnline } from '@/hooks/useIsOnline';
import { createRealmFormStyles } from '@/styles/app/modals/form.style';

interface FormValues {
  name: string;
  description: string;
  is_public: boolean;
  location: { latitude: number | null; longitude: number | null; radius: number };
  image: string | null;
  tags: any[];
}

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
          <View style={[styles.sectionIconContainer, { marginLeft: theme.spacing.m }]}>
            <Ionicons name={icon as any} size={18} color={theme.colors.primary} />
          </View>
        )}
      </View>

      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
};

export default function RealmForm() {
  const params = useLocalSearchParams();
  const realmId = params.id as string;
  const isEditing = !!realmId;
  const theme = useAppTheme();
  const styles = createRealmFormStyles(theme);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const userId = user?.id || '';
  const isOnline = useIsOnline();

  const realmQuery = useRealmQuery(realmId);
  const { data: existingImageUrl } = useRealmPrimaryImageUrl(realmId);
  const createRealmMutation = useCreateRealmMutation();
  const updateRealmMutation = useUpdateRealmMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  const { data: tags = [] } = useTagsQuery(userId);
  useInvalidateTagsOnFocus(userId);
  const createTagMutation = useCreateTagMutation();

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });
  const [pendingNavigation, setPendingNavigation] = useState<null | (() => void)>(null);

  const { data: realmTags = [], isLoading: isLoadingRealmTags } = useLocationTagsQuery(realmId);

  const methods = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      is_public: false,
      location: { latitude: null, longitude: null, radius: 100 },
      image: null,
      tags: realmTags,
    },
    mode: 'onChange',
  });

  const { handleSubmit, reset, watch, setValue } = methods;
  const watchedValues = watch();

  useEffect(() => {
    if (isEditing && realmQuery.data && !isLoadingRealmTags) {
      const realm = realmQuery.data;
      try {
        reset({
          name: realm.name,
          description: realm.description || '',
          is_public: false,
          location: {
            latitude: realm.latitude,
            longitude: realm.longitude,
            radius: realm.radius || 100,
          },
          image: existingImageUrl || null,
          tags: realmTags,
        });
      } catch {
        setSnackbar({
          visible: true,
          message: 'Error al cargar las etiquetas del realm.',
          type: 'error',
        });
      }
    }
  }, [isEditing, realmQuery.data, existingImageUrl, realmTags, isLoadingRealmTags, reset]);

  // force set tags when editing realm
  useEffect(() => {
    if (isEditing && !isLoadingRealmTags && realmTags) {
      setValue('tags', realmTags);
    }
  }, [isEditing, isLoadingRealmTags, realmTags, setValue]);

  function handleGoBackOrReplace() {
    const from = params.from;
    const detailsId = params.id;
    if (from === 'map') {
      router.replace('/map');
    } else if (from === 'details' && detailsId) {
      router.replace(`/realms/${detailsId}`);
    } else {
      router.replace('/realms');
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      if (!isOnline) {
        setSnackbar({
          visible: true,
          message: 'No tienes conexión a internet. Por favor, conéctate e intenta nuevamente.',
          type: 'error',
        });
        return;
      }

      if (!userId) {
        setSnackbar({
          visible: true,
          message: 'Usuario no autenticado',
          type: 'error',
        });
        return;
      }

      if (!data.location.latitude || !data.location.longitude) {
        setSnackbar({
          visible: true,
          message: 'Por favor, selecciona una ubicación en el mapa antes de continuar.',
          type: 'error',
        });
        return;
      }

      let newRealm;
      let imageChanged = false;
      let imageUploadSuccess = false;
      try {
        if (isEditing) {
          newRealm = await updateRealmMutation.mutateAsync({
            id: realmId,
            data: {
              name: data.name,
              description: data.description,
              is_public: data.is_public,
              latitude: data.location.latitude,
              longitude: data.location.longitude,
              radius: data.location.radius,
              updated_at: new Date().toISOString(),
            },
          });
        } else {
          newRealm = await createRealmMutation.mutateAsync({
            name: data.name,
            description: data.description,
            is_public: data.is_public,
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            radius: data.location.radius,
            user_id: userId,
          });
        }

        if (newRealm && Array.isArray(data.tags)) {
          await setTagsForRealm(newRealm.id, data.tags, isEditing);
        }

        if (data.image && newRealm && data.image !== existingImageUrl) {
          imageChanged = true;
          try {
            await uploadMediaMutation.mutateAsync({
              userId,
              entityType: 'location',
              entityId: newRealm.id,
              localUri: data.image,
              isPrimary: true,
            });
            imageUploadSuccess = true;
          } catch (uploadError: any) {
            setSnackbar({
              visible: true,
              message:
                uploadError?.message ||
                (isEditing
                  ? 'Realm actualizado, pero falló la subida de la imagen'
                  : 'Realm creado, pero falló la subida de la imagen'),
              type: 'error',
            });
            setPendingNavigation(null);
            return;
          }
        }

        let message = '';
        if (imageChanged && imageUploadSuccess) {
          message = isEditing ? 'Realm e imagen actualizados' : 'Realm e imagen creados';
        } else {
          message = isEditing ? 'Realm actualizado' : 'Realm creado';
        }
        setSnackbar({
          visible: true,
          message,
          type: 'success',
        });
        setPendingNavigation(() => handleGoBackOrReplace);
      } catch (realmError: any) {
        setSnackbar({
          visible: true,
          message: realmError?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el realm`,
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

  if (isEditing && realmQuery.isLoading) {
    return <LoadingScreen />;
  }

  const loading =
    createRealmMutation.isPending || updateRealmMutation.isPending || uploadMediaMutation.isPending;
  return (
    <FormProvider {...methods}>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {/* Header unificado */}
        <CustomFormHeader
          title={isEditing ? 'Editar Realm' : 'Crear Nuevo Realm'}
          onBack={handleGoBackOrReplace}
        />

        <ScrollView
          contentContainerStyle={[styles.formContainer, { paddingBottom: 120 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FormSection
            title="Información Básica"
            subtitle="Dale un nombre único y una descripción atractiva a tu realm"
            icon="create-outline"
            styles={styles}
          >
            <View style={styles.inputSpacing}>
              <ControlledTextInput
                name="name"
                label="Nombre del Realm"
                placeholder="Ej: Mi Lugar Secreto"
              />
            </View>
            <View style={styles.inputSpacingLast}>
              <ControlledTextInput
                name="description"
                label="Descripción"
                placeholder="Describe qué hace especial a este lugar..."
                multiline
                numberOfLines={3}
              />
            </View>
          </FormSection>
          <FormSection
            title="Ubicación y Área"
            subtitle="Define la ubicación geográfica y el radio de tu realm"
            icon="location-outline"
            styles={styles}
          >
            <CircleMapPickerInput name="location" label="Selecciona ubicación y ajusta el radio" />
          </FormSection>
          <FormSection
            title="Imagen Representativa"
            subtitle="Una buena imagen que te ayuda a identificar tu realm"
            icon="image-outline"
            styles={styles}
          >
            {/* same size as card */}
            <ControlledImagePicker name="image" aspectRatio={16 / 9} />
          </FormSection>
          <FormSection
            title="Etiquetas"
            subtitle="Ayuda a otros a encontrar tu realm con etiquetas descriptivas"
            icon="pricetag-outline"
            styles={styles}
          >
            {isLoadingRealmTags && isEditing ? (
              <View style={{ alignItems: 'center', padding: 16 }}>
                <Text>Cargando etiquetas...</Text>
              </View>
            ) : (
              <>
                <TagSelector name="tags" options={tags} loading={createTagMutation.isPending} />
              </>
            )}
          </FormSection>
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
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading || !isOnline || !watchedValues.name?.trim()}
              style={styles.primaryButton}
            >
              {loading
                ? isEditing
                  ? 'Actualizando...'
                  : 'Creando...'
                : isEditing
                  ? 'Actualizar Realm'
                  : 'Crear Realm'}
            </Button>
            <Button
              mode="outlined"
              onPress={handleGoBackOrReplace}
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
