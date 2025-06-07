import { useLocalSearchParams, router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { CustomFormHeader } from '@/components/common/CustomFormHeader';
import { FeedbackSnackbar } from '@/components/common/FeedbackSnackbar';
import { ControlledImagePicker } from '@/components/forms/ControlledImagePicker';
import { ControlledTextInput } from '@/components/forms/ControlledTextInput';
import { TagSelector } from '@/components/forms/TagSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useUploadMediaMutation } from '@/features/media/hooks';
import {
  useTagsQuery,
  useCreateTagMutation,
  useAddTagToTreasureMutation,
  useRemoveTagFromTreasureMutation,
} from '@/features/tags/hooks';
import {
  useCreateTreasureMutation,
  useUpdateTreasureMutation,
  useTreasureQuery,
} from '@/features/treasures/hooks';
import { createRealmFormStyles } from '@/styles/app/modals/form.style';

interface TreasureFormValues {
  name: string;
  description: string;
  image?: string;
  tags?: { id: string; name: string; color?: string }[];
}

export default function TreasureFormScreen() {
  const params = useLocalSearchParams<{ nookId?: string; id?: string; from?: string }>();
  const nookId = params.nookId;
  const treasureId = params.id;
  const mode: 'create' | 'edit' = treasureId ? 'edit' : 'create';
  const theme = useAppTheme();
  const { user } = useAuth();
  const styles = createRealmFormStyles(theme);

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  // Cargar datos iniciales si es edición
  const { data: treasure, isLoading: isLoadingTreasure } = useTreasureQuery(treasureId || '');
  // Obtener imagen principal del treasure en edición
  // Lógica igual que realm-form: usar un hook específico si existe, o implementarlo aquí
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  useEffect(() => {
    const fetchImage = async () => {
      if (mode === 'edit' && treasureId) {
        try {
          const { data, error } = await (await import('@/utils/supabase')).supabase
            .from('media')
            .select('storage_path')
            .eq('entity_type', 'treasure')
            .eq('entity_id', treasureId)
            .order('is_primary', { ascending: false })
            .limit(1)
            .single();
          if (error || !data) {
            setExistingImageUrl(null);
          } else {
            // Obtener la URL pública
            const { data: urlData } = (await import('@/utils/supabase')).supabase.storage
              .from('media')
              .getPublicUrl(data.storage_path);
            setExistingImageUrl(urlData?.publicUrl ?? null);
          }
        } catch {
          setExistingImageUrl(null);
        }
      }
    };
    fetchImage();
  }, [mode, treasureId]);

  // --- TAGS PARA TREASURE ---
  // Hook para obtener los tags asociados a un treasure
  const [treasureTags, setTreasureTags] = useState<any[]>([]);
  const [isLoadingTreasureTags, setIsLoadingTreasureTags] = useState(false);
  useEffect(() => {
    const fetchTags = async () => {
      if (mode === 'edit' && treasureId) {
        setIsLoadingTreasureTags(true);
        try {
          const { data, error } = await (await import('@/utils/supabase')).supabase
            .from('treasure_tags')
            .select('tag_id, tags:tag_id (id, name, color)')
            .eq('treasure_id', treasureId);
          if (error) throw new Error(error.message);
          setTreasureTags((data || []).map((item: any) => item.tags));
        } catch {
          setTreasureTags([]);
          setSnackbar({
            visible: true,
            message: 'Error al cargar las etiquetas del treasure.',
            type: 'error',
          });
        } finally {
          setIsLoadingTreasureTags(false);
        }
      }
    };
    fetchTags();
  }, [mode, treasureId]);

  const methods = useForm<TreasureFormValues>({
    defaultValues: {
      name: treasure?.name || '',
      description: treasure?.description || '',
      image: mode === 'edit' && existingImageUrl ? existingImageUrl : '',
      tags: treasureTags,
    },
    mode: 'onChange',
  });

  const { handleSubmit, watch, reset, setValue } = methods;
  const watched = watch();

  // Si es edición, setear los valores cuando treasure esté disponible y los tags cargados
  useEffect(() => {
    if (mode === 'edit' && treasure && !isLoadingTreasureTags) {
      reset({
        name: treasure.name || '',
        description: treasure.description || '',
        image: existingImageUrl || '',
        tags: treasureTags,
      });
    }
  }, [mode, treasure, treasureTags, isLoadingTreasureTags, existingImageUrl, reset]);

  // Forzar la precarga de tags en edición cuando treasureTags cambian
  useEffect(() => {
    if (mode === 'edit' && !isLoadingTreasureTags && treasureTags) {
      // console.log('[TreasureForm] setValue tags:', treasureTags);
      setValue('tags', treasureTags);
    }
  }, [mode, isLoadingTreasureTags, treasureTags, setValue]);

  const createTreasureMutation = useCreateTreasureMutation();
  const updateTreasureMutation = useUpdateTreasureMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  const createTagMutation = useCreateTagMutation();
  const addTagToTreasureMutation = useAddTagToTreasureMutation();
  const removeTagFromTreasureMutation = useRemoveTagFromTreasureMutation();
  const { data: tags = [] } = useTagsQuery(user?.id || '');

  const handleSave = async (data: TreasureFormValues) => {
    if (!user) {
      setSnackbar({
        visible: true,
        message: 'Debes iniciar sesión para guardar el treasure.',
        type: 'error',
      });
      return;
    }
    if ((mode === 'create' && !nookId) || !data.name) {
      setSnackbar({
        visible: true,
        message: 'Faltan datos obligatorios.',
        type: 'error',
      });
      return;
    }
    try {
      let treasureResult;
      if (mode === 'edit' && treasureId) {
        // Actualizar treasure
        treasureResult = await updateTreasureMutation.mutateAsync({
          id: treasureId,
          data: {
            name: data.name,
            description: data.description,
            // nook_location_id: treasure?.nook_location_id, // No se permite cambiar de nook
            // user_id: user.id, // No se cambia
          },
        });
      } else {
        // Crear treasure
        treasureResult = await createTreasureMutation.mutateAsync({
          name: data.name,
          description: data.description,
          nook_location_id: nookId!,
          user_id: user.id,
        });
      }

      // Sincronizar tags
      const selectedTags = data.tags || [];
      let currentTags: any[] = [];
      if (mode === 'edit' && treasureTags) {
        currentTags = treasureTags;
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
        await addTagToTreasureMutation.mutateAsync({
          treasure_id: treasureResult.id,
          tag_id: tag.id,
        });
      }
      // Eliminar tags desasociados
      for (const tag of tagsToRemove) {
        await removeTagFromTreasureMutation.mutateAsync({
          treasure_id: treasureResult.id,
          tag_id: tag.id,
        });
      }

      // Subir imagen si existe y es diferente a la actual
      let imageSuccess = false;
      if (data.image && data.image !== existingImageUrl) {
        try {
          await uploadMediaMutation.mutateAsync({
            userId: user.id,
            entityType: 'treasure',
            entityId: treasureResult.id,
            localUri: data.image,
            isPrimary: true,
          });
          imageSuccess = true;
        } catch {
          setSnackbar({
            visible: true,
            message: `${mode === 'edit' ? 'Treasure actualizado' : 'Treasure creado'}, pero la imagen no se pudo subir`,
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
              ? 'Treasure e imagen actualizados con éxito'
              : 'Treasure actualizado con éxito'
            : imageSuccess
              ? 'Treasure e imagen creados con éxito'
              : 'Treasure creado con éxito',
        type: 'success',
      });
      setTimeout(() => {
        if (mode === 'edit') {
          router.replace(`/treasures/${treasureResult.id}`);
        } else {
          router.replace(`/nooks/${nookId}`);
        }
      }, 1800);
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message:
          error?.message || `No se pudo ${mode === 'edit' ? 'actualizar' : 'crear'} el treasure`,
        type: 'error',
      });
    }
  };

  const handleBackNavigation = () => {
    if (mode === 'edit' && treasure?.nook_location_id) {
      router.replace(`/nooks/${treasure.nook_location_id}`);
    } else if (nookId) {
      router.replace(`/nooks/${nookId}`);
    } else {
      router.back();
    }
  };

  if (mode === 'edit' && isLoadingTreasure) {
    return null;
  }
  return (
    <FormProvider {...methods}>
      <SafeAreaView style={styles.container}>
        <CustomFormHeader
          title={mode === 'edit' ? 'Editar Treasure' : 'Crear Treasure'}
          onBack={handleBackNavigation}
        />
        <ScrollView
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
        >
          <ControlledTextInput
            name="name"
            label="Nombre del Treasure"
            placeholder="Ej: Pasaporte"
          />
          <ControlledTextInput
            name="description"
            label="Descripción"
            placeholder="Describe el objeto..."
            multiline
            numberOfLines={3}
          />
          <ControlledImagePicker name="image" />
          {isLoadingTreasureTags && mode === 'edit' ? (
            <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 16 }}>
              {/* Usar el componente Text correcto de tu proyecto */}
              <Button mode="text" disabled style={{ opacity: 0.7 }}>
                Cargando etiquetas...
              </Button>
            </ScrollView>
          ) : (
            <TagSelector
              name="tags"
              label="Etiquetas"
              options={tags}
              loading={createTagMutation.isPending}
              disabled={isLoadingTreasureTags && mode === 'edit'}
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
          )}
          <Button
            mode="contained"
            onPress={handleSubmit(handleSave)}
            disabled={
              (mode === 'edit'
                ? updateTreasureMutation.isPending
                : createTreasureMutation.isPending) || !watched.name?.trim()
            }
            loading={
              mode === 'edit' ? updateTreasureMutation.isPending : createTreasureMutation.isPending
            }
            style={styles.primaryButton}
          >
            {mode === 'edit'
              ? updateTreasureMutation.isPending
                ? 'Guardando...'
                : 'Guardar cambios'
              : createTreasureMutation.isPending
                ? 'Creando...'
                : 'Crear Treasure'}
          </Button>
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
