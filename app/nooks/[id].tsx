import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router, Href } from 'expo-router';
import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Image } from 'react-native';
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
import { useTreasuresQuery } from '@/features/treasures/hooks';
import { createStyles } from '@/styles/app/nooks/details.style';

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

  const handleTreasurePress = (treasureId: string) => {
    router.push(`/treasures/${treasureId}`);
  };

  const renderTreasureItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.treasureCard}
      onPress={() => handleTreasurePress(item.id)}
      activeOpacity={0.8}
    >
      <Text style={styles.treasureTitle}>{item.name}</Text>
      {item.description && <Text style={styles.treasureDescription}>{item.description}</Text>}
    </TouchableOpacity>
  );

  // Componente Header para FlatList
  const renderHeader = () => {
    if (!nook) return null;

    return (
      <>
        {/* Espaciador para el header fijo */}
        <View style={styles.headerSpacer} />

        {/* Imagen principal */}
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

        {/* Contenido principal */}
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{nook.name}</Text>

            {nook.description && <Text style={styles.description}>{nook.description}</Text>}

            {nook.latitude && nook.longitude && (
              <Text style={styles.location}>
                📍 {nook.latitude.toFixed(5)}, {nook.longitude.toFixed(5)}
              </Text>
            )}
          </View>

          {/* Sección de treasures */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Treasures {treasures.length !== undefined && `(${treasures.length})`}
            </Text>
            <Button mode="contained" onPress={handleCreateTreasure}>
              Crear Treasure
            </Button>
          </View>
        </View>
      </>
    );
  };

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

        {/* Lista con contenido */}
        <FlatList
          data={treasures}
          renderItem={renderTreasureItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={treasures.length === 0 ? { flexGrow: 1 } : undefined}
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
