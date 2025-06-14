import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
import { useNooksQuery } from '@/features/nooks/hooks';
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

interface TreasureFormValues {
  name: string;
  description: string;
  image?: string;
  tags?: { id: string; name: string; color?: string }[];
}

export default function TreasureFormScreen() {
  const params = useLocalSearchParams<{
    nookId?: string;
    id?: string;
    from?: string;
    realmId?: string;
  }>();
  const nookId = params.nookId;
  const realmId = params.realmId;
  const treasureId = params.id;
  const mode: 'create' | 'edit' = treasureId ? 'edit' : 'create';
  const theme = useAppTheme();
  const { user } = useAuth();
  const userId = user?.id || '';
  const styles = createRealmFormStyles(theme);
  const isOnline = useIsOnline();
  const insets = useSafeAreaInsets();

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });
  const [pendingNavigation, setPendingNavigation] = useState<null | (() => void)>(null);

  // load treasure data if editing
  const { data: treasure, isLoading: isLoadingTreasure } = useTreasureQuery(treasureId || '');
  const { data: existingImageUrl } = useTreasurePrimaryImageUrl(treasureId || '');

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

  // Set values when editing and treasure/tags are loaded
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

  // Ejecutar navegación pendiente cuando se cierre el snackbar
  useEffect(() => {
    if (!snackbar.visible && pendingNavigation) {
      const navigation = pendingNavigation;
      setPendingNavigation(null);
      // Ejecutar la navegación después de un pequeño delay para evitar problemas de render
      setTimeout(() => {
        navigation();
      }, 100);
    }
  }, [snackbar.visible, pendingNavigation]);
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
  const { data: nooks = [], isLoading: isLoadingNooks } = useNooksQuery(realmId || '');
  useInvalidateTagsOnFocus(userId);
  // Debug logs para verificar que los datos están llegando correctamente
  useEffect(() => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('🐛 [TreasureForm] Debug info:', {
        realmId,
        nookId,
        nooksCount: nooks.length,
        isLoadingNooks,
        mode,
      });
      // eslint-disable-next-line no-console
      console.log('🐛 [TreasureForm] Nooks data:', nooks);
    }
  }, [realmId, nookId, nooks.length, isLoadingNooks, mode, nooks]);

  const loading =
    createTreasureMutation.isPending ||
    updateTreasureMutation.isPending ||
    uploadMediaMutation.isPending;

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

      let treasureResult: any;
      let imageChanged = false;
      let imageUploadSuccess = false;
      try {
        if (mode === 'edit' && treasureId) {
          treasureResult = await updateTreasureMutation.mutateAsync({
            id: treasureId,
            data: {
              name: data.name,
              description: data.description,
              updated_at: new Date().toISOString(),
            },
          });
        } else {
          treasureResult = await createTreasureMutation.mutateAsync({
            name: data.name,
            description: data.description,
            nook_location_id: nookId!,
            user_id: user.id,
          });
        }

        if (treasureResult && Array.isArray(data.tags)) {
          const selectedTags = data.tags || [];
          let currentTags: any[] = [];
          if (mode === 'edit' && treasureTags) {
            currentTags = treasureTags;
          }

          const tagsToAdd = selectedTags.filter(
            (tag: any) => !currentTags.some((t: any) => t.id === tag.id)
          );
          const tagsToRemove = currentTags.filter(
            (tag: any) => !selectedTags.some((t: any) => t.id === tag.id)
          );
          for (const tag of tagsToAdd) {
            await addTagToTreasureMutation.mutateAsync({
              treasure_id: treasureResult.id,
              tag_id: tag.id,
            });
          }
          for (const tag of tagsToRemove) {
            await removeTagFromTreasureMutation.mutateAsync({
              treasure_id: treasureResult.id,
              tag_id: tag.id,
            });
          }
        }

        // only upload image if it has changed
        if (data.image && treasureResult && data.image !== existingImageUrl) {
          imageChanged = true;
          try {
            await uploadMediaMutation.mutateAsync({
              userId: user.id,
              entityType: 'treasure',
              entityId: treasureResult.id,
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
                  ? 'Treasure actualizado, pero falló la subida de la imagen'
                  : 'Treasure creado, pero falló la subida de la imagen'),
              type: 'error',
            });
            setPendingNavigation(null);
            return;
          }
        }

        let message = '';
        if (imageChanged && imageUploadSuccess) {
          message =
            mode === 'edit' ? 'Treasure e imagen actualizados' : 'Treasure e imagen creados';
        } else {
          message = mode === 'edit' ? 'Treasure actualizado' : 'Treasure creado';
        }
        setSnackbar({
          visible: true,
          message,
          type: 'success',
        });
        setPendingNavigation(() => {
          if (mode === 'edit') {
            return () => router.replace(`/treasures/${treasureResult.id}`);
          } else {
            // Después de crear, ir al detalle del treasure recién creado
            return () => router.replace(`/treasures/${treasureResult.id}`);
          }
        });
      } catch (treasureError: any) {
        setSnackbar({
          visible: true,
          message:
            treasureError?.message ||
            `Error al ${mode === 'edit' ? 'actualizar' : 'crear'} el treasure`,
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
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Cargando treasure...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Si no hay nookId y estamos en modo crear, redirigir al selector de nook
  if (!nookId && mode === 'create') {
    router.replace('/(tabs)/treasures');
    return null;
  }

  return (
    <FormProvider {...methods}>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <CustomFormHeader
          title={mode === 'edit' ? 'Editar Treasure' : 'Crear Treasure'}
          onBack={handleBackNavigation}
        />

        <ScrollView
          contentContainerStyle={[styles.formContainer, { paddingBottom: 120 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FormSection
            title="Información Básica"
            subtitle="Dale un nombre único a tu treasure"
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

          <FormSection
            title="Imagen Representativa"
            subtitle="Una imagen que identifique a tu treasure"
            icon="image-outline"
            styles={styles}
          >
            <ControlledImagePicker name="image" aspectRatio={16 / 9} />
          </FormSection>

          <FormSection
            title="Etiquetas"
            subtitle="Ayuda a encontrar tu treasure con etiquetas descriptivas"
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
          onDismiss={() => {
            setSnackbar({ ...snackbar, visible: false });
          }}
          message={snackbar.message}
          type={snackbar.type}
        />
      </SafeAreaView>
    </FormProvider>
  );
}
