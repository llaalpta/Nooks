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
import { useSearchTreasuresQuery, useAllTreasuresQuery } from '@/features/search/hooks'; // CORRECTED IMPORT
import { TreasureCard } from '@/features/treasures/components/TreasureCard';
import { useTreasurePrimaryImageUrl } from '@/features/treasures/hooks';
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
      {/* Header with title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Treasures</Text>
        <Text style={styles.headerSubtitle}>All your saved items</Text>
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

        {hasActiveSearch && (
          <View style={styles.resultsIndicator}>
            <Text style={styles.resultsText}>
              {treasuresToShow.length} treasure{treasuresToShow.length !== 1 ? 's' : ''} found
            </Text>
            <TouchableOpacity onPress={handleClearSearch}>
              <Text style={styles.clearFiltersText}>Clear search</Text>
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
    </SafeAreaView>
  );
}
