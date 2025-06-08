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
  useTreasurePrimaryImageUrl,
} from '@/features/treasures/hooks';
import { useInvalidateTagsOnFocus } from '@/hooks/useInvalidateTagsOnFocus';
import { useIsOnline } from '@/hooks/useIsOnline';
import { createRealmFormStyles } from '@/styles/app/modals/form.style';

// Componente de sección unificado (igual que en realm-form y nook-form)
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
      {/* Header de la sección (icono al final) */}
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

      {/* Contenido */}
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
};

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
  const userId = user?.id || '';
  const styles = createRealmFormStyles(theme);
  const isOnline = useIsOnline();

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  // Cargar datos iniciales si es edición
  const { data: treasure, isLoading: isLoadingTreasure } = useTreasureQuery(treasureId || '');
  const { data: existingImageUrl } = useTreasurePrimaryImageUrl(treasureId || '');

  // --- TAGS PARA TREASURE ---
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
      name: '',
      description: '',
      image: '',
      tags: treasureTags,
    },
    mode: 'onChange',
  });

  const { handleSubmit, watch, reset, setValue } = methods;
  const watchedValues = watch();

  // Si es edición, setear los valores cuando treasure esté disponible y los tags cargados
  useEffect(() => {
    if (mode === 'edit' && treasure && !isLoadingTreasureTags) {
      try {
        reset({
          name: treasure.name || '',
          description: treasure.description || '',
          image: existingImageUrl || '',
          tags: treasureTags,
        });
      } catch {
        setSnackbar({
          visible: true,
          message: 'Error al cargar las etiquetas del treasure.',
          type: 'error',
        });
      }
    }
  }, [mode, treasure, treasureTags, isLoadingTreasureTags, existingImageUrl, reset]);

  // Forzar la precarga de tags en edición cuando treasureTags cambian
  useEffect(() => {
    if (mode === 'edit' && !isLoadingTreasureTags && treasureTags) {
      setValue('tags', treasureTags);
    }
  }, [mode, isLoadingTreasureTags, treasureTags, setValue]);

  const createTreasureMutation = useCreateTreasureMutation();
  const updateTreasureMutation = useUpdateTreasureMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  const createTagMutation = useCreateTagMutation();
  const addTagToTreasureMutation = useAddTagToTreasureMutation();
  const removeTagFromTreasureMutation = useRemoveTagFromTreasureMutation();
  const { data: tags = [] } = useTagsQuery(userId);
  useInvalidateTagsOnFocus(userId);

  const handleSave = async (data: TreasureFormValues) => {
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

      if ((mode === 'create' && !nookId) || !data.name) {
        setSnackbar({
          visible: true,
          message: 'Por favor, completa el nombre del treasure antes de continuar.',
          type: 'error',
        });
        return;
      }

      let treasureResult;
      try {
        if (mode === 'edit' && treasureId) {
          // Actualizar treasure
          treasureResult = await updateTreasureMutation.mutateAsync({
            id: treasureId,
            data: {
              name: data.name,
              description: data.description,
              updated_at: new Date().toISOString(),
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
        if (treasureResult && Array.isArray(data.tags)) {
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
        }

        setSnackbar({
          visible: true,
          message: mode === 'edit' ? 'Treasure actualizado con éxito' : 'Treasure creado con éxito',
          type: 'success',
        });
      } catch (treasureError: any) {
        setSnackbar({
          visible: true,
          message:
            treasureError?.message ||
            `Error al ${mode === 'edit' ? 'actualizar' : 'crear'} el treasure`,
          type: 'error',
        });
        return;
      }

      // Subir imagen si existe y es diferente a la actual
      if (data.image && treasureResult && data.image !== existingImageUrl) {
        try {
          await uploadMediaMutation.mutateAsync({
            userId: user.id,
            entityType: 'treasure',
            entityId: treasureResult.id,
            localUri: data.image,
            isPrimary: true,
          });
          setSnackbar({
            visible: true,
            message:
              mode === 'edit'
                ? 'Treasure e imagen actualizados con éxito'
                : 'Treasure e imagen creados con éxito',
            type: 'success',
          });
        } catch (uploadError: any) {
          setSnackbar({
            visible: true,
            message:
              uploadError?.message ||
              (mode === 'edit'
                ? 'Treasure actualizado, pero falló la subida de la imagen'
                : 'Treasure creado, pero falló la subida de la imagen'),
            type: 'error',
          });
        }
      }

      setTimeout(() => {
        if (mode === 'edit') {
          router.replace(`/treasures/${treasureResult.id}`);
        } else {
          router.replace(`/nooks/${nookId}`);
        }
      }, 2000);
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: `Error inesperado: ${error.message}`,
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

  const loading =
    createTreasureMutation.isPending ||
    updateTreasureMutation.isPending ||
    uploadMediaMutation.isPending;

  return (
    <FormProvider {...methods}>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header unificado */}
        <CustomFormHeader
          title={mode === 'edit' ? 'Editar Treasure' : 'Crear Treasure'}
          onBack={handleBackNavigation}
        />

        <ScrollView
          contentContainerStyle={[styles.formContainer, { paddingBottom: 120 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Sección 1: Información Básica */}
          <FormSection
            title="Información Básica"
            subtitle="Dale un nombre único y una descripción detallada a tu treasure"
            icon="create-outline"
            styles={styles}
          >
            <View style={styles.inputSpacing}>
              <ControlledTextInput
                name="name"
                label="Nombre del Treasure"
                placeholder="Ej: Pasaporte"
              />
            </View>
            <View style={styles.inputSpacingLast}>
              <ControlledTextInput
                name="description"
                label="Descripción"
                placeholder="Describe el objeto..."
                multiline
                numberOfLines={3}
              />
            </View>
          </FormSection>

          {/* Sección 2: Imagen Representativa */}
          <FormSection
            title="Imagen Representativa"
            subtitle="Una buena imagen que te ayuda a identificar tu treasure"
            icon="image-outline"
            styles={styles}
          >
            <ControlledImagePicker name="image" aspectRatio={16 / 9} />
          </FormSection>

          {/* Sección 3: Etiquetas */}
          <FormSection
            title="Etiquetas"
            subtitle="Ayuda a otros a encontrar tu treasure con etiquetas descriptivas"
            icon="pricetag-outline"
            styles={styles}
          >
            {isLoadingTreasureTags && mode === 'edit' ? (
              <View style={{ alignItems: 'center', padding: 16 }}>
                <Text>Cargando etiquetas...</Text>
              </View>
            ) : (
              <TagSelector
                name="tags"
                options={tags}
                loading={createTagMutation.isPending}
                disabled={isLoadingTreasureTags && mode === 'edit'}
              />
            )}
          </FormSection>
        </ScrollView>

        {/* Botones de acción flotantes */}
        <View style={styles.floatingActionContainer} pointerEvents="box-none">
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
              disabled={loading || !isOnline || !watchedValues.name?.trim()}
              style={styles.primaryButton}
            >
              {loading
                ? mode === 'edit'
                  ? 'Actualizando...'
                  : 'Creando...'
                : mode === 'edit'
                  ? 'Actualizar Treasure'
                  : 'Crear Treasure'}
            </Button>
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
          onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
          message={snackbar.message}
          type={snackbar.type}
        />
      </SafeAreaView>
    </FormProvider>
  );
}
