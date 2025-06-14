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

  const { data: nook, isLoading: isLoadingNook, isError: isErrorNook } = useNookQuery(nookId);
  const { data: primaryImageUrl } = useNookPrimaryImageUrl(nookId);
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
      pathname: '/treasures/treasure-form',
      params: { nookId },
    });
  };

  // component that wraps TreasureCard to include image loading
  function TreasureCardWithImage({ treasure }: { treasure: any }) {
    const { data: imageUrl } = useTreasurePrimaryImageUrl(treasure.id);

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

  // flatlist header
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
        </View>

        <View style={styles.treasuresSection}>
          <View style={styles.treasuresSectionHeader}>
            <View style={styles.treasuresTitleContainer}>
              <Text style={styles.treasuresTitle}>Treasures</Text>
              <Image
                source={require('@/assets/images/treasure.png')}
                style={{
                  width: 24,
                  height: 24,
                  marginRight: theme.spacing.s,
                }}
                resizeMode="contain"
              />
              {treasures && treasures.length !== undefined && (
                <View style={styles.treasuresCounter}>
                  <Text style={styles.treasuresCounterText}>{treasures.length}</Text>
                </View>
              )}
            </View>
            <Button mode="contained" onPress={handleCreateTreasure}>
              Crear Treasure
            </Button>
          </View>
        </View>
      </>
    );
  };

  const renderTreasureItem = ({ item }: { item: any }) => (
    <View style={{ paddingHorizontal: theme.spacing.m }}>
      <TreasureCardWithImage treasure={item} />
    </View>
  );

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
                  gap: 10,
                  paddingBottom: 85,
                }
          }
          showsVerticalScrollIndicator={false}
          bounces={true}
          alwaysBounceVertical={false}
          ListFooterComponent={<View style={styles.listFooter} />}
        />

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
