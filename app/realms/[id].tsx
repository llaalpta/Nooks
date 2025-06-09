import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState } from 'react';
import { View, FlatList, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { Dialog } from '@/components/atoms/Dialog/Dialog';
import { Text } from '@/components/atoms/Text';
import { DetailsScreenHeader } from '@/components/common/DetailsScreenHeader';
import { FeedbackSnackbar } from '@/components/common/FeedbackSnackbar';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { NookCard } from '@/features/nooks/components/NookCard';
import { useNooksQuery, useNookPrimaryImageUrl } from '@/features/nooks/hooks';
import { hasNooks } from '@/features/realms/api';
import {
  useRealmQuery,
  useRealmPrimaryImageUrl,
  useDeleteRealmMutation,
} from '@/features/realms/hooks';
import { createStyles } from '@/styles/app/realms/details.style';
import { formatArea } from '@/utils/realmUtils';

interface Tag {
  id: string;
  name: string;
  color?: string;
}

export default function RealmDetailScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);
  const params = useLocalSearchParams<{ id: string }>();
  const realmId = params.id;
  const { user } = useAuth();
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const deleteMutation = useDeleteRealmMutation();
  const { data: realm, isLoading: isLoadingRealm, isError: isErrorRealm } = useRealmQuery(realmId);
  const { data: imageUrl } = useRealmPrimaryImageUrl(realmId);
  const {
    data: nooks = [],
    isLoading: isLoadingNooks,
    isError: isErrorNooks,
  } = useNooksQuery(realmId);

  const handleEditRealm = () => {
    setShowOptionsMenu(false);
    router.push({
      pathname: '/realms/realm-form',
      params: { id: realmId, from: 'details' },
    });
  };

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteRealm = () => {
    setShowOptionsMenu(false);
    setShowDeleteDialog(true);
  };

  const handleConfirmDeleteRealm = async () => {
    setDeleteLoading(true);
    try {
      const hasChildren = await hasNooks(realmId);
      if (hasChildren) {
        setSnackbar({
          visible: true,
          message:
            'Este realm contiene nooks. Elimina los nooks primero antes de eliminar el realm.',
          type: 'error',
        });
        setShowDeleteDialog(false);
        setDeleteLoading(false);
        return;
      }

      await deleteMutation.mutateAsync(realmId);
      setSnackbar({
        visible: true,
        message: 'Realm eliminado con éxito',
        type: 'success',
      });
      setShowDeleteDialog(false);
      setDeleteLoading(false);
      router.push('/(tabs)/realms');
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error?.message || 'No se pudo eliminar el realm',
        type: 'error',
      });
      setShowDeleteDialog(false);
      setDeleteLoading(false);
    }
  };

  const handleCreateNook = () => {
    if (!user) {
      setSnackbar({
        visible: true,
        message: 'Debes iniciar sesión para realizar esta acción',
        type: 'error',
      });
      return;
    }
    router.push({
      pathname: '/nooks/nook-form',
      params: { realmId },
    });
  };

  function NookCardWithImage({ nook }: { nook: any }) {
    const { data: imageUrl } = useNookPrimaryImageUrl(nook.id);

    const validTags = (nook.tags || [])
      .filter((tag: any) => tag && tag.name && typeof tag.name === 'string')
      .map((tag: any) => ({
        id: tag.id || `tag-${Math.random()}`,
        name: tag.name,
        color: tag.color ?? undefined,
      }));

    return (
      <NookCard
        nook={{
          ...nook,
          name: nook.name || 'Sin nombre',
          description:
            nook.description && typeof nook.description === 'string' ? nook.description : null,
          imageUrl,
          tags: validTags,
          treasuresCount: typeof nook.treasuresCount === 'number' ? nook.treasuresCount : undefined,
        }}
      />
    );
  }

  const renderNookItem = ({ item }: { item: any }) => <NookCardWithImage nook={item} />;

  const renderHeader = () => {
    if (!realm) return null;

    return (
      <>
        {/* Imagen principal */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
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
            <Text style={styles.headerTitle}>{realm.name || 'Sin nombre'}</Text>
            {realm.description &&
              typeof realm.description === 'string' &&
              realm.description.trim() && (
                <Text style={styles.description}>{realm.description}</Text>
              )}

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
                source={require('@/assets/images/realm-marker-small.png')}
                style={{
                  width: 32,
                  height: 32,
                }}
                resizeMode="contain"
              />
              {realm.latitude && realm.longitude && (
                <Text style={styles.location}>
                  {realm.latitude.toFixed(6)}, {realm.longitude.toFixed(6)}
                  {realm.radius ? ` ◯ ${formatArea(realm.radius)}` : ''}
                </Text>
              )}
            </View>

            {Array.isArray((realm as any).tags) && (realm as any).tags.length > 0 && (
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
                  {(realm as any).tags.map((tag: Tag) => {
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
        <View style={styles.nooksCard}>
          <View style={styles.nooksTitleContainer}>
            <Text style={styles.nooksTitle}>Nooks</Text>
            {nooks && nooks.length !== undefined && (
              <View style={styles.nooksCounter}>
                <Text style={styles.nooksCounterText}>{nooks.length}</Text>
              </View>
            )}
          </View>
          <Button mode="contained" onPress={handleCreateNook}>
            Crear Nook
          </Button>
        </View>
      </>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hay nooks en este realm. ¡Crea el primero!</Text>
    </View>
  );

  if (isLoadingRealm || isLoadingNooks) {
    return <LoadingScreen />;
  }

  if (isErrorRealm || !realm) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <DetailsScreenHeader
          title="Error al cargar realm"
          backRoute="/(tabs)/realms"
          showOptionsMenu={false}
          optionsMenuItems={[]}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se pudo cargar el realm</Text>
          <Button mode="contained" onPress={() => router.push('/(tabs)/realms')}>
            Volver a Realms
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  if (isErrorNooks) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <DetailsScreenHeader
          title={'Detalles del Realm'}
          backRoute="/(tabs)/realms"
          showOptionsMenu={showOptionsMenu}
          onToggleOptionsMenu={() => setShowOptionsMenu(!showOptionsMenu)}
          optionsMenuItems={
            realm
              ? [
                  {
                    icon: 'pencil-outline',
                    label: 'Editar realm',
                    onPress: handleEditRealm,
                    color: theme.colors.primary,
                  },
                  {
                    icon: 'trash-outline',
                    label: 'Eliminar realm',
                    onPress: handleDeleteRealm,
                    color: theme.colors.error,
                  },
                ]
              : []
          }
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se pudieron cargar los nooks de este realm.</Text>
          <Button mode="contained" onPress={() => router.replace(`/realms/${realmId}`)}>
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
        title="Eliminar realm"
        description="¿Estás seguro de que quieres eliminar este realm? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDeleteRealm}
        onCancel={() => setShowDeleteDialog(false)}
        confirmColor={theme.colors.error}
        cancelColor={theme.colors.onSurfaceVariant}
        loading={deleteLoading}
      />
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <DetailsScreenHeader
          title={'Detalles del Realm'}
          backRoute="/(tabs)/realms"
          showOptionsMenu={showOptionsMenu}
          onToggleOptionsMenu={() => setShowOptionsMenu(!showOptionsMenu)}
          optionsMenuItems={
            realm
              ? [
                  {
                    icon: 'pencil-outline',
                    label: 'Editar realm',
                    onPress: handleEditRealm,
                    color: theme.colors.primary,
                  },
                  {
                    icon: 'trash-outline',
                    label: 'Eliminar realm',
                    onPress: handleDeleteRealm,
                    color: theme.colors.error,
                  },
                ]
              : []
          }
        />

        <FlatList
          data={nooks}
          renderItem={renderNookItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={
            nooks.length === 0
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
