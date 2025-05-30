import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, ScrollView } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
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
  useRealmPrimaryImageUrl, // Agregar este hook
} from '@/features/realms/hooks';
import { useTagsQuery, useCreateTagMutation } from '@/features/tags/hooks';
import { useIsOnline } from '@/hooks/useIsOnline';

import { createStyles } from './styles/realm-form.style';

interface FormValues {
  name: string;
  description: string;
  is_public: boolean;
  location: { latitude: number | null; longitude: number | null; radius: number };
  image: string | null;
  tags: any[];
}

export default function RealmForm() {
  const params = useLocalSearchParams();
  const realmId = params.id as string;
  const isEditing = !!realmId;
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);
  const { user } = useAuth();
  const userId = user?.id || '';
  const isOnline = useIsOnline();

  const realmQuery = useRealmQuery(realmId);
  const { data: existingImageUrl } = useRealmPrimaryImageUrl(realmId); // Obtener imagen existente
  const createRealmMutation = useCreateRealmMutation();
  const updateRealmMutation = useUpdateRealmMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  const { data: tags = [] } = useTagsQuery(userId);
  const createTagMutation = useCreateTagMutation();

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });
  const methods = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      is_public: false, // Hardcodeado como false por defecto
      location: { latitude: null, longitude: null, radius: 100 },
      image: null,
      tags: [],
    },
  });

  const { handleSubmit, reset } = methods;
  useEffect(() => {
    if (isEditing && realmQuery.data) {
      const realm = realmQuery.data;
      reset({
        name: realm.name,
        description: realm.description || '',
        is_public: false, // Siempre false, no público
        location: {
          latitude: realm.latitude,
          longitude: realm.longitude,
          radius: realm.radius || 100,
        },
        image: existingImageUrl || null, // Establecer la imagen existente
        tags: [],
      });
    }
  }, [isEditing, realmQuery.data, existingImageUrl, reset]); // Agregar existingImageUrl a las dependencias
  async function handleCreateTag(name: string, color: string) {
    if (!user?.id) return null;
    try {
      const newTag = await createTagMutation.mutateAsync({
        name,
        user_id: user.id,
        color: color,
      });
      return newTag;
    } catch {
      return null;
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
      let newRealm;
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
        setSnackbar({
          visible: true,
          message: isEditing ? 'Realm actualizado con éxito' : 'Realm creado con éxito',
          type: 'success',
        });
      } catch (realmError: any) {
        setSnackbar({
          visible: true,
          message: realmError?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el realm`,
          type: 'error',
        });
        return;
      }

      // Solo subir imagen si es diferente a la existente (nueva imagen seleccionada)
      if (data.image && newRealm && data.image !== existingImageUrl) {
        try {
          await uploadMediaMutation.mutateAsync({
            userId,
            entityType: 'location',
            entityId: newRealm.id,
            localUri: data.image,
            isPrimary: true,
          });
          setSnackbar({
            visible: true,
            message: isEditing
              ? 'Realm e imagen actualizados con éxito'
              : 'Realm e imagen creados con éxito',
            type: 'success',
          });
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
        }
      }
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: `Error inesperado: ${error.message}`,
        type: 'error',
      });
    }
  };

  if (isEditing && realmQuery.isLoading) {
    return <LoadingScreen />;
  }

  const loading =
    createRealmMutation.isPending || updateRealmMutation.isPending || uploadMediaMutation.isPending;

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            {isEditing ? 'Editar Realm' : 'Crear Nuevo Realm'}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formControl}>
            <ControlledTextInput name="name" label="" placeholder="Nombre del Realm" />
          </View>
          <View style={styles.formControl}>
            <ControlledTextInput
              name="description"
              label=""
              placeholder="Descripción del Realm"
              multiline
              numberOfLines={2}
            />
          </View>
          <View style={styles.formControl}>
            {/* <Text style={styles.sectionTitle}>Ubicación</Text> */}
            <CircleMapPickerInput name="location" label="Selecciona el área del realm" />
          </View>
          <View style={styles.formControl}>
            {/* <Text style={styles.sectionTitle}>Imagen</Text> */}
            <ControlledImagePicker name="image" />
          </View>
          <View style={styles.formControl}>
            <Text style={styles.sectionTitle}>Etiquetas</Text>
            <TagSelector
              name="tags"
              options={tags}
              loading={createTagMutation.isPending}
              onCreateTag={handleCreateTag}
            />
          </View>
          <View style={styles.formControl}>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading}
            >
              {isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </View>
        </ScrollView>

        <FeedbackSnackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
          message={snackbar.message}
          type={snackbar.type}
        />
      </View>
    </FormProvider>
  );
}
