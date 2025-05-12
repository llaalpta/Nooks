import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, ScrollView } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { FeedbackSnackbar } from '@/components/common/FeedbackSnackbar';
import LoadingScreen from '@/components/common/LoadingScreen';
import { ControlledImagePicker } from '@/components/forms/ControlledImagePicker';
import { ControlledSwitch } from '@/components/forms/ControlledSwitch';
import { ControlledTextInput } from '@/components/forms/ControlledTextInput';
import { MapPickerInput } from '@/components/forms/MapPickerInput';
import { TagSelector } from '@/components/forms/TagSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useUploadMediaMutation } from '@/features/media/hooks';
import { setTagsForRealm } from '@/features/realms/api';
import {
  useRealmQuery,
  useUpdateRealmMutation,
  useCreateRealmMutation,
} from '@/features/realms/hooks';
import { useTagsQuery, useCreateTagMutation } from '@/features/tags/hooks';
import { useIsOnline } from '@/hooks/useIsOnline';
import { Colors } from '@/src/theme/colors';

import { createStyles } from './styles/realm-form.styles';

interface FormValues {
  name: string;
  description: string;
  is_public: boolean;
  location: { latitude: number | null; longitude: number | null };
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
      is_public: false,
      location: { latitude: null, longitude: null },
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
        is_public: realm.is_public || false,
        location: {
          latitude: realm.latitude,
          longitude: realm.longitude,
        },
        image: null,
        tags: [], // Cargar las etiquetas desde una consulta separada si es necesario
      });
    }
  }, [isEditing, realmQuery.data, reset]);

  async function handleCreateTag(name: string) {
    if (!user?.id) return null;
    try {
      const newTag = await createTagMutation.mutateAsync({
        name,
        user_id: user.id,
        color: Colors.lightColors.secondary, // Color por defecto
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
            user_id: userId,
          });
        }
        // --- ASOCIAR TAGS AL REALM ---
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
      if (data.image && newRealm) {
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
            <ControlledTextInput name="name" label="Nombre" placeholder="Nombre del Realm" />
          </View>

          <View style={styles.formControl}>
            <ControlledTextInput
              name="description"
              label="Descripción"
              placeholder="Descripción del Realm"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formControl}>
            <ControlledSwitch name="is_public" label="¿Es público?" />
          </View>

          <View style={styles.formControl}>
            <Text style={styles.sectionTitle}>Ubicación</Text>
            <MapPickerInput name="location" label="Selecciona la ubicación" />
          </View>

          <View style={styles.formControl}>
            <Text style={styles.sectionTitle}>Imagen</Text>
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
