import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router, Href } from 'expo-router';
import React, { useState } from 'react';
import { View, FlatList, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { Dialog } from '@/components/atoms/Dialog/Dialog';
import { Text } from '@/components/atoms/Text';
import { DetailsScreenHeader } from '@/components/common/DetailsScreenHeader';
import { FeedbackSnackbar } from '@/components/common/FeedbackSnackbar';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useAppTheme } from '@/contexts/ThemeContext';
import {
  useNookQuery,
  useDeleteNookMutation,
  useNookPrimaryImageUrl,
} from '@/features/nooks/hooks';
import { TreasureCard } from '@/features/treasures/components/TreasureCard';
import { useTreasurePrimaryImageUrl, useTreasuresQuery } from '@/features/treasures/hooks';
import { createStyles } from '@/styles/app/nooks/details.style';

interface Tag {
  id: string;
  name: string;
  color?: string;
}

export default function NookDetailScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);
  const params = useLocalSearchParams<{ id: string }>();
  const nookId = params.id;

  // Datos del nook
  const { data: nook, isLoading: isLoadingNook, isError: isErrorNook } = useNookQuery(nookId);
  // Imagen principal del nook (URL pública)
  const { data: primaryImageUrl } = useNookPrimaryImageUrl(nookId);
  // Treasures del nook
  const {
    data: treasures = [],
    isLoading: isLoadingTreasures,
    isError: isErrorTreasures,
  } = useTreasuresQuery(nookId);

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteNookMutation = useDeleteNookMutation();

  // Calcular backRoute
  const backRoute = nook?.parent_location_id
    ? `/realms/${nook.parent_location_id}`
    : '/(tabs)/realms';

  const handleEditNook = () => {
    setShowOptionsMenu(false);
    router.push({
      pathname: '/nooks/nook-form',
      params: { id: nookId, from: 'details' },
    });
  };

  const handleDeleteNook = () => {
    setShowOptionsMenu(false);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!nook) return;
    // No permitir borrar si hay treasures
    if (treasures && treasures.length > 0) {
      setSnackbar({
        visible: true,
        message: 'No puedes eliminar un nook que contiene treasures. Elimínalos primero.',
        type: 'error',
      });
      setShowDeleteDialog(false);
      return;
    }
    try {
      await deleteNookMutation.mutateAsync(nookId);
      setSnackbar({
        visible: true,
        message: 'Nook eliminado correctamente',
        type: 'success',
      });
      setShowDeleteDialog(false);
      // Navegar al padre (Realm)
      router.push(backRoute as any);
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error?.message || 'No se pudo eliminar el nook',
        type: 'error',
      });
      setShowDeleteDialog(false);
    }
  };

  const handleCreateTreasure = () => {
    router.push({
      pathname: '/(modals)/treasure-form',
      params: { nookId },
    });
  };

  // Componente que inyecta la imagen principal del treasure
  function TreasureCardWithImage({ treasure }: { treasure: any }) {
    const { data: imageUrl } = useTreasurePrimaryImageUrl(treasure.id);

    // Filtrar y validar tags antes de pasarlas al componente
    const validTags = (treasure.tags || [])
      .filter((tag: any) => tag && tag.name && typeof tag.name === 'string')
      .map((tag: any) => ({
        id: tag.id || `tag-${Math.random()}`,
        name: tag.name,
        color: tag.color ?? undefined,
      }));

    return (
      <TreasureCard
        treasure={{
          ...treasure,
          name: treasure.name || 'Sin nombre',
          description:
            treasure.description && typeof treasure.description === 'string'
              ? treasure.description
              : null,
          imageUrl,
          tags: validTags,
        }}
      />
    );
  }

  // Componente Header para FlatList
  const renderHeader = () => {
    if (!nook) return null;

    return (
      <>
        <View style={styles.imageContainer}>
          {primaryImageUrl ? (
            <Image source={{ uri: primaryImageUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="image-outline" size={64} color={theme.colors.outlineVariant} />
              <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                Sin imagen principal
              </Text>
            </View>
          )}
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{nook.name || 'Sin nombre'}</Text>

            {nook.description &&
              typeof nook.description === 'string' &&
              nook.description.trim() && <Text style={styles.description}>{nook.description}</Text>}
            <Text
              style={{ marginTop: theme.spacing.s, color: theme.colors.primary }}
              variant="titleSmall"
            >
              Localizacion
            </Text>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.m }}
            >
              <Image
                source={require('@/assets/images/realm-marker.png')}
                style={{
                  width: 32,
                  height: 32,
                }}
                resizeMode="contain"
              />
              {nook.latitude && nook.longitude && (
                <Text style={styles.location}>
                  {nook.latitude.toFixed(6)}, {nook.longitude.toFixed(6)}
                </Text>
              )}
            </View>

            {/* Tags con validación COMPLETA - usando estilos inline ya que eliminaste los del archivo */}
            {Array.isArray((nook as any).tags) && (nook as any).tags.length > 0 && (
              <>
                <Text
                  style={{ marginTop: theme.spacing.s, color: theme.colors.primary }}
                  variant="titleSmall"
                >
                  Tags
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: theme.spacing.s,
                    marginTop: theme.spacing.m,
                  }}
                >
                  {(nook as any).tags.map((tag: Tag) => {
                    // Validar que el tag tenga nombre válido
                    if (!tag || !tag.name || typeof tag.name !== 'string') return null;

                    return (
                      <View
                        key={tag.id || `tag-${Math.random()}`}
                        style={{
                          backgroundColor: tag.color || theme.colors.primaryContainer,
                          paddingHorizontal: theme.spacing.m,
                          paddingVertical: theme.spacing.s,
                          borderRadius: theme.borderRadius.m,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: '500',
                            color: theme.colors.onSurface,
                          }}
                        >
                          {tag.name}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </View>

          {/* Sección de treasures con validación */}
        </View>
        <View style={styles.nooksCard}>
          <View style={styles.nooksTitleContainer}>
            <Text style={styles.nooksTitle}>Treasures</Text>
            {treasures && treasures.length !== undefined && (
              <View style={styles.nooksCounter}>
                <Text style={styles.nooksCounterText}>{treasures.length}</Text>
              </View>
            )}
          </View>
          <Button mode="contained" onPress={handleCreateTreasure}>
            Crear Treasure
          </Button>
        </View>
      </>
    );
  };

  // ✅ ÚNICA DEFINICIÓN - Render item con wrapper para padding
  const renderTreasureItem = ({ item }: { item: any }) => (
    <View style={{ paddingHorizontal: theme.spacing.m }}>
      <TreasureCardWithImage treasure={item} />
    </View>
  );

  // Componente Empty para cuando no hay treasures
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hay treasures en este nook. ¡Crea el primero!</Text>
    </View>
  );

  if (isLoadingNook || isLoadingTreasures) {
    return <LoadingScreen />;
  }

  if (isErrorNook || !nook) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <DetailsScreenHeader
          title="Error al cargar nook"
          backRoute="/(tabs)/realms"
          showOptionsMenu={false}
          optionsMenuItems={[]}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se pudo cargar el nook</Text>
          <Button mode="contained" onPress={() => router.push('/(tabs)/realms')}>
            Volver a Realms
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  if (isErrorTreasures) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <DetailsScreenHeader
          title={'Detalles del Nook'}
          backRoute={backRoute as Href}
          showOptionsMenu={showOptionsMenu}
          onToggleOptionsMenu={() => setShowOptionsMenu(!showOptionsMenu)}
          optionsMenuItems={
            nook
              ? [
                  {
                    icon: 'pencil-outline',
                    label: 'Editar nook',
                    onPress: handleEditNook,
                    color: theme.colors.primary,
                  },
                  {
                    icon: 'trash-outline',
                    label: 'Eliminar nook',
                    onPress: handleDeleteNook,
                    color: theme.colors.error,
                  },
                ]
              : []
          }
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se pudieron cargar los treasures de este nook.</Text>
          <Button mode="contained" onPress={() => router.replace(`/nooks/${nookId}`)}>
            Reintentar
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Dialog
        visible={showDeleteDialog}
        title="Eliminar nook"
        description="¿Estás seguro? Esta acción no se puede deshacer"
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
        confirmColor={theme.colors.error}
        cancelColor={theme.colors.onSurfaceVariant}
        loading={deleteNookMutation.isPending}
      />
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <DetailsScreenHeader
          title={'Detalles del Nook'}
          backRoute={backRoute as Href}
          showOptionsMenu={showOptionsMenu}
          onToggleOptionsMenu={() => setShowOptionsMenu(!showOptionsMenu)}
          optionsMenuItems={
            nook
              ? [
                  {
                    icon: 'pencil-outline',
                    label: 'Editar nook',
                    onPress: handleEditNook,
                    color: theme.colors.primary,
                  },
                  {
                    icon: 'trash-outline',
                    label: 'Eliminar nook',
                    onPress: handleDeleteNook,
                    color: theme.colors.error,
                  },
                ]
              : []
          }
        />

        {/* Lista con contenido usando el mismo estilo que RealmsScreen */}
        <FlatList
          data={treasures}
          renderItem={renderTreasureItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={
            treasures.length === 0
              ? { flexGrow: 1 }
              : {
                  paddingTop: 10,
                  gap: 10,
                  paddingBottom: 85,
                  minHeight: '100%',
                }
          }
          showsVerticalScrollIndicator={false}
          bounces={true}
          ListFooterComponent={<View style={styles.listFooter} />}
        />

        {/* Snackbar para feedback */}
        <FeedbackSnackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
          message={snackbar.message}
          type={snackbar.type}
        />
      </SafeAreaView>
    </>
  );
}
