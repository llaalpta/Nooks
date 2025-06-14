import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { FloatingActionButton } from '@/components/atoms/FloatingActionButton';
import { Text } from '@/components/atoms/Text';
import { TextInput } from '@/components/atoms/TextInput';
import BottomRealmsList from '@/components/common/BottomRealmsList';
import { EmptyState } from '@/components/common/EmptyState';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useRealmsQuery } from '@/features/realms/hooks';
import { useSearchTreasuresQuery, useAllTreasuresQuery } from '@/features/search/hooks'; // CORRECTED IMPORT
import { TreasureCard } from '@/features/treasures/components/TreasureCard';
import { useTreasurePrimaryImageUrl } from '@/features/treasures/hooks';
import { useLocationService } from '@/hooks/useLocationService';
import { createStyles } from '@/styles/app/tabs/realms.style';

import type { Tables } from '@/types/supabase';

type Tag = Tables<'tags'>;
type TreasureWithTags = Tables<'treasures'> & { tags: Tag[]; imageUrl?: string | null };

function TreasureCardWithImage({ treasure }: { treasure: TreasureWithTags }) {
  const theme = useAppTheme();

  const { data: imageUrl } = useTreasurePrimaryImageUrl(treasure.id);

  const validTags = (treasure.tags || [])
    .filter((tag: any) => tag && tag.name && typeof tag.name === 'string' && tag.id && tag.user_id)
    .map((tag: any) => ({
      ...tag,
      color: tag.color ?? null,
    }));

  return (
    <View style={{ paddingHorizontal: theme.spacing.m }}>
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
    </View>
  );
}

export default function TreasuresScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { user } = useAuth();

  const [searchText, setSearchText] = useState('');
  const [tagSearchText, setTagSearchText] = useState('');
  const [showRealmsList, setShowRealmsList] = useState(false);
  const [showRealmMenu, setShowRealmMenu] = useState(false);
  const { data: realms = [] } = useRealmsQuery(user?.id || '');
  const { getCurrentLocation } = useLocationService();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const {
    data: treasuresFromApi = [],
    isLoading,
    isError,
    refetch,
  } = useAllTreasuresQuery(user?.id || '');

  const { data: searchResults = [] } = useSearchTreasuresQuery(user?.id || '', searchText.trim());

  const treasuresToShow = useMemo(() => {
    let filteredTreasures: TreasureWithTags[];

    if (searchText.trim()) {
      filteredTreasures = searchResults as TreasureWithTags[];
    } else {
      filteredTreasures = treasuresFromApi as TreasureWithTags[];
    }

    // Filter by tag name (local search) // TODO: this should be a server-side search
    if (tagSearchText.trim()) {
      const normalizedTagSearch = tagSearchText.toLowerCase().trim();
      filteredTreasures = filteredTreasures.filter((treasure) => {
        if (!Array.isArray(treasure.tags)) return false;
        return treasure.tags.some(
          (tag) => tag.name && tag.name.toLowerCase().includes(normalizedTagSearch)
        );
      });
    }

    return filteredTreasures.filter((treasure) => {
      return (
        treasure &&
        treasure.id &&
        typeof treasure.id === 'string' &&
        treasure.name !== null &&
        treasure.name !== undefined
      );
    });
  }, [searchText, searchResults, treasuresFromApi, tagSearchText]);

  // Obtener ubicación del usuario al abrir el selector de realms
  const handleCreateTreasure = async () => {
    setShowRealmMenu(true);
  };

  const handleChooseRealm = async () => {
    setIsLoadingLocation(true);

    try {
      if (!userLocation) {
        const location = await getCurrentLocation();
        setUserLocation(location);
      }

      // Pequeño delay para mostrar el loading antes de abrir la lista
      setTimeout(() => {
        setShowRealmMenu(false);
        setShowRealmsList(true);
        setIsLoadingLocation(false);
      }, 800);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsLoadingLocation(false);
      setShowRealmMenu(false);
    }
  };
  const handleCreateRealm = () => {
    setShowRealmMenu(false);
    router.push({ pathname: '/realms/realm-form', params: { from: 'treasures' } });
  };
  // Cuando el usuario selecciona un realm, continuar con el flujo de selección de nook o creación de treasure
  const handleRealmSelect = (realm: any) => {
    setShowRealmsList(false);
    router.push({ pathname: '/treasures/nook-selector', params: { realmId: realm.id } });
  };

  const handleRetry = () => {
    refetch();
  };

  const handleClearSearch = () => {
    setSearchText('');
    setTagSearchText('');
  };

  const renderItem = ({ item }: { item: TreasureWithTags }) => {
    if (!item || !item.id) return null;
    return <TreasureCardWithImage treasure={item} />;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <EmptyState
          message="Ocurrió un error al cargar los treasures."
          actionLabel="Reintentar"
          onAction={handleRetry}
        />
      </SafeAreaView>
    );
  }

  const hasActiveSearch = searchText.trim() || tagSearchText.trim();
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {/* Header with title */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Mis Treasures</Text>
            <Text style={styles.headerSubtitle}>Todos tus elementos guardados</Text>
          </View>
          <Image
            source={require('@/assets/images/treasure.png')}
            style={{
              width: 40,
              height: 40,
              marginLeft: theme.spacing.m,
            }}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar por nombre del treasure..."
          style={styles.searchInput}
          rightElement={
            searchText ? (
              <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
                <Ionicons name="close" size={20} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            ) : (
              <Ionicons name="search" size={20} color={theme.colors.onSurfaceVariant} />
            )
          }
        />

        <TextInput
          value={tagSearchText}
          onChangeText={setTagSearchText}
          placeholder="Buscar por etiqueta..."
          style={styles.searchInput}
          rightElement={
            tagSearchText ? (
              <TouchableOpacity onPress={() => setTagSearchText('')} style={styles.clearButton}>
                <Ionicons name="close" size={20} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            ) : (
              <Ionicons name="pricetag" size={20} color={theme.colors.onSurfaceVariant} />
            )
          }
        />

        {hasActiveSearch && (
          <View style={styles.resultsIndicator}>
            <Text style={styles.resultsText}>
              {treasuresToShow.length} treasure{treasuresToShow.length !== 1 ? 's' : ''} found
            </Text>
            <TouchableOpacity onPress={handleClearSearch}>
              <Text style={styles.clearFiltersText}>Limpiar filtro</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {treasuresToShow.length > 0 ? (
        <FlatList
          data={treasuresToShow}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id || Math.random().toString()}
          contentContainerStyle={{
            paddingTop: 10,
            gap: 10,
            paddingBottom: 85,
            minHeight: '100%',
          }}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={false}
          initialNumToRender={10}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            message={
              hasActiveSearch
                ? 'No se encontraron treasures con esos criterios'
                : 'No tienes treasures todavía'
            }
            actionLabel={hasActiveSearch ? 'Limpiar búsqueda' : 'Crear nuevo treasure'}
            onAction={hasActiveSearch ? handleClearSearch : handleCreateTreasure}
          />
        </View>
      )}

      <FloatingActionButton onPress={handleCreateTreasure} icon="add" />

      {/* Menú previo para crear o elegir realm */}
      <Modal visible={showRealmMenu} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing.l,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.l,
              padding: theme.spacing.l,
              minWidth: 280,
              maxWidth: '90%',
              ...theme.elevation.level3,
            }}
          >
            <Text
              variant="headlineSmall"
              style={{
                color: theme.colors.onSurface,
                fontWeight: '600',
                marginBottom: theme.spacing.l,
                textAlign: 'center',
              }}
            >
              ¿Qué quieres hacer?
            </Text>
            <Button
              mode="contained"
              onPress={handleCreateRealm}
              style={{ marginBottom: theme.spacing.l }}
            >
              Crear nuevo realm
            </Button>
            <Button
              mode="outlined"
              onPress={handleChooseRealm}
              loading={isLoadingLocation}
              disabled={isLoadingLocation}
              style={{ marginBottom: theme.spacing.l }}
            >
              {isLoadingLocation ? 'Obteniendo ubicación...' : 'Elegir realm existente'}
            </Button>
            <TouchableOpacity
              onPress={() => setShowRealmMenu(false)}
              style={{
                alignSelf: 'center',
              }}
            >
              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.primary,
                  fontWeight: '500',
                }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showRealmsList && (
        <BottomRealmsList
          realms={realms}
          userLocation={userLocation}
          onRealmSelect={handleRealmSelect}
          onClose={() => {
            setShowRealmsList(false);
            setIsLoadingLocation(false);
          }}
          showAllRealms={true}
        />
      )}
    </SafeAreaView>
  );
}
