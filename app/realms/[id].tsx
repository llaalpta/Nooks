import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { Dialog } from '@/components/atoms/Dialog/Dialog';
import { Text } from '@/components/atoms/Text';
import { DetailsScreenHeader } from '@/components/common/DetailsScreenHeader';
import { FeedbackSnackbar } from '@/components/common/FeedbackSnackbar';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useNooksQuery } from '@/features/nooks/hooks';
import { hasNooks } from '@/features/realms/api';
import {
  useRealmQuery,
  useRealmPrimaryImageUrl,
  useDeleteRealmMutation,
} from '@/features/realms/hooks';
import { createStyles } from '@/styles/app/realms/details.style';

import type { Tables } from '@/types/supabase';

type Nook = Tables<'locations'>;

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
  // Obtener los datos del realm desde Supabase
  const { data: realm, isLoading: isLoadingRealm, isError: isErrorRealm } = useRealmQuery(realmId);
  // Obtener la imagen principal del realm
  const { data: imageUrl } = useRealmPrimaryImageUrl(realmId);
  // Obtener los nooks del realm desde Supabase
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
            'Este reino contiene nooks. Elimina los nooks primero antes de eliminar el reino.',
          type: 'error',
        });
        setShowDeleteDialog(false);
        setDeleteLoading(false);
        return;
      }

      await deleteMutation.mutateAsync(realmId);
      setSnackbar({
        visible: true,
        message: 'Reino eliminado con éxito',
        type: 'success',
      });
      setShowDeleteDialog(false);
      setDeleteLoading(false);
      router.push('/(tabs)/realms');
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error?.message || 'No se pudo eliminar el reino',
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

  const handleNookPress = (nookId: string) => {
    router.push(`/nooks/${nookId}`);
  };

  const renderNookItem = ({ item }: { item: Nook }) => (
    <TouchableOpacity
      style={styles.nookCard}
      onPress={() => handleNookPress(item.id)}
      activeOpacity={0.7}
    >
      <Text style={styles.nookTitle}>{item.name}</Text>
      {item.description && <Text style={styles.nookDescription}>{item.description}</Text>}
    </TouchableOpacity>
  );

  // Componente Header para FlatList
  const renderHeader = () => {
    if (!realm) return null;

    return (
      <>
        {/* Espaciador para el header fijo */}
        <View style={styles.headerSpacer} />

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

        {/* Contenido principal */}
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{realm.name}</Text>

            {realm.description && <Text style={styles.description}>{realm.description}</Text>}

            {realm.latitude && realm.longitude && (
              <Text style={styles.location}>
                📍 {realm.latitude.toFixed(5)}, {realm.longitude.toFixed(5)}
                {realm.radius && ` • Radio: ${realm.radius.toFixed(0)}m`}
              </Text>
            )}

            {/* Tags */}
            {Array.isArray((realm as any).tags) && (realm as any).tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {(realm as any).tags.map((tag: Tag) => (
                  <View
                    key={tag.id}
                    style={[styles.tag, tag.color ? { backgroundColor: tag.color } : null]}
                  >
                    <Text style={[styles.tagText, tag.color ? { color: '#FFFFFF' } : null]}>
                      {tag.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Sección de nooks */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Nooks {nooks.length !== undefined && `(${nooks.length})`}
            </Text>
            <Button mode="contained" onPress={handleCreateNook}>
              Crear Nook
            </Button>
          </View>
        </View>
      </>
    );
  };

  // Componente Empty para cuando no hay nooks
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hay nooks en este reino. ¡Crea el primero!</Text>
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
          <Text style={styles.emptyText}>No se pudo cargar el reino</Text>
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
                    label: 'Editar reino',
                    onPress: handleEditRealm,
                    color: theme.colors.primary,
                  },
                  {
                    icon: 'trash-outline',
                    label: 'Eliminar reino',
                    onPress: handleDeleteRealm,
                    color: theme.colors.error,
                  },
                ]
              : []
          }
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se pudieron cargar los nooks de este reino.</Text>
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
        title="Eliminar reino"
        description="¿Estás seguro de que quieres eliminar este reino? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDeleteRealm}
        onCancel={() => setShowDeleteDialog(false)}
        confirmColor={theme.colors.error}
        cancelColor={theme.colors.onSurfaceVariant}
        loading={deleteLoading}
      />
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        {/* Header fijo */}
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
                    label: 'Editar reino',
                    onPress: handleEditRealm,
                    color: theme.colors.primary,
                  },
                  {
                    icon: 'trash-outline',
                    label: 'Eliminar reino',
                    onPress: handleDeleteRealm,
                    color: theme.colors.error,
                  },
                ]
              : []
          }
        />

        {/* Lista con contenido */}
        <FlatList
          data={nooks}
          renderItem={renderNookItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={nooks.length === 0 ? { flexGrow: 1 } : undefined}
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
