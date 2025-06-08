import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingActionButton } from '@/components/atoms/FloatingActionButton';
import { Text } from '@/components/atoms/Text';
import { TextInput } from '@/components/atoms/TextInput';
import { EmptyState } from '@/components/common/EmptyState';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useSearchTreasuresQuery, useAllTreasuresQuery } from '@/features/search/hooks'; // 🔥 IMPORT CORREGIDO
import { TreasureCard } from '@/features/treasures/components/TreasureCard';
import { useTreasurePrimaryImageUrl } from '@/features/treasures/hooks';
import { createStyles } from '@/styles/app/tabs/realms.style';

import type { Tables } from '@/types/supabase';

// Tipo para treasures con tags
type Tag = Tables<'tags'>;
type TreasureWithTags = Tables<'treasures'> & { tags: Tag[]; imageUrl?: string | null };

function TreasureCardWithImage({ treasure }: { treasure: TreasureWithTags }) {
  const theme = useAppTheme(); // 🔥 USAR useAppTheme() EN LUGAR DE IMPORT

  // Obtener imagen principal
  const { data: imageUrl } = useTreasurePrimaryImageUrl(treasure.id);

  // Validar y mapear tags igual que en NookDetailScreen
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

  // 🔥 Estados para búsqueda - DOS CAMPOS SEPARADOS
  const [searchText, setSearchText] = useState('');
  const [tagSearchText, setTagSearchText] = useState('');

  // 🔥 Queries principales - USAR HOOK CORRECTO
  const {
    data: treasuresFromApi = [],
    isLoading,
    isError,
    refetch,
  } = useAllTreasuresQuery(user?.id || ''); // 🔥 HOOK CORRECTO

  // 🔥 Query de búsqueda por nombre (solo se ejecuta cuando hay texto)
  const { data: searchResults = [] } = useSearchTreasuresQuery(user?.id || '', searchText.trim());

  // 🔥 Determinar qué datos mostrar - IGUAL QUE REALMS
  const treasuresToShow = useMemo(() => {
    let filteredTreasures: TreasureWithTags[];

    // Si hay búsqueda por nombre, usar resultados de búsqueda
    if (searchText.trim()) {
      filteredTreasures = searchResults as TreasureWithTags[];
    } else {
      // Si no hay búsqueda por nombre, usar todos los treasures
      filteredTreasures = treasuresFromApi as TreasureWithTags[];
    }

    // 🔥 Filtrar por nombre de etiqueta (búsqueda local)
    if (tagSearchText.trim()) {
      const normalizedTagSearch = tagSearchText.toLowerCase().trim();
      filteredTreasures = filteredTreasures.filter((treasure) => {
        if (!Array.isArray(treasure.tags)) return false;
        return treasure.tags.some(
          (tag) => tag.name && tag.name.toLowerCase().includes(normalizedTagSearch)
        );
      });
    }

    // Validar treasures
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

  const handleCreateTreasure = () => {
    router.push({ pathname: '/(modals)/treasure-form', params: { from: 'list' } });
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
      {/* Header con título */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Treasures</Text>
        <Text style={styles.headerSubtitle}>Todos tus objetos guardados</Text>
      </View>

      {/* 🔥 Sección de búsqueda - DOS CAMPOS */}
      <View style={styles.searchContainer}>
        {/* Campo de búsqueda por nombre */}
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

        {/* Campo de búsqueda por etiquetas */}
        <TextInput
          value={tagSearchText}
          onChangeText={setTagSearchText}
          placeholder="Buscar por nombre de etiqueta..."
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

        {/* 🔥 Indicador de resultados */}
        {hasActiveSearch && (
          <View style={styles.resultsIndicator}>
            <Text style={styles.resultsText}>
              {treasuresToShow.length} treasure{treasuresToShow.length !== 1 ? 's' : ''} encontrado
              {treasuresToShow.length !== 1 ? 's' : ''}
            </Text>
            <TouchableOpacity onPress={handleClearSearch}>
              <Text style={styles.clearFiltersText}>Limpiar búsqueda</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Lista de treasures */}
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
    </SafeAreaView>
  );
}
