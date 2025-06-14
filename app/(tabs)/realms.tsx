import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingActionButton } from '@/components/atoms/FloatingActionButton';
import { Text } from '@/components/atoms/Text';
import { TextInput } from '@/components/atoms/TextInput';
import { EmptyState } from '@/components/common/EmptyState';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { RealmCard } from '@/features/realms/components/RealmCard';
import { useRealmsQuery, useRealmPrimaryImageUrl } from '@/features/realms/hooks';
import { useSearchRealmsQuery } from '@/features/search/hooks'; // Search hook
import { createStyles } from '@/styles/app/tabs/realms.style';

import type { Tables } from '@/types/supabase';

type Tag = Tables<'tags'>;
type RealmWithTags = Tables<'locations'> & { tags: Tag[] };

function RealmCardWithImage({ realm }: { realm: RealmWithTags }) {
  const { data: imageUrl } = useRealmPrimaryImageUrl(realm.id);

  if (!realm || !realm.id) {
    return null;
  }

  return (
    <RealmCard
      realm={{
        ...realm,
        imageUrl,
        tags: Array.isArray(realm.tags) ? realm.tags : [],
      }}
    />
  );
}

export default function RealmsScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { user } = useAuth();

  const [searchText, setSearchText] = useState('');
  const [tagSearchText, setTagSearchText] = useState('');

  const { data: realmsFromApi = [], isLoading, isError, refetch } = useRealmsQuery(user?.id || '');

  const { data: searchResults = [] } = useSearchRealmsQuery(user?.id || '', searchText.trim());

  const realmsToShow = useMemo(() => {
    let filteredRealms: RealmWithTags[];

    // if searching by name, use search results
    if (searchText.trim()) {
      filteredRealms = searchResults as RealmWithTags[];
    } else {
      // if not, use all
      filteredRealms = realmsFromApi as RealmWithTags[];
    }

    // Filter by tag name (local search) // TODO : this should be a server-side search
    if (tagSearchText.trim()) {
      const normalizedTagSearch = tagSearchText.toLowerCase().trim();
      filteredRealms = filteredRealms.filter((realm) => {
        if (!Array.isArray(realm.tags)) return false;
        return realm.tags.some(
          (tag) => tag.name && tag.name.toLowerCase().includes(normalizedTagSearch)
        );
      });
    }

    return filteredRealms.filter((realm) => {
      return (
        realm &&
        realm.id &&
        typeof realm.id === 'string' &&
        realm.name !== null &&
        realm.name !== undefined
      );
    });
  }, [searchText, searchResults, realmsFromApi, tagSearchText]);

  const handleCreateRealm = () => {
    router.push({ pathname: '/realms/realm-form', params: { from: 'list' } });
  };

  const handleRetry = () => {
    refetch();
  };

  const handleClearSearch = () => {
    setSearchText('');
    setTagSearchText('');
  };

  const renderItem = ({ item }: { item: RealmWithTags }) => {
    if (!item || !item.id) {
      return null;
    }
    return <RealmCardWithImage realm={item} />;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <EmptyState
          message="Ocurrió un error al cargar los realms."
          actionLabel="Reintentar"
          onAction={handleRetry}
        />
      </SafeAreaView>
    );
  }

  const hasActiveSearch = searchText.trim() || tagSearchText.trim();
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Mis Realms</Text>
            <Text style={styles.headerSubtitle}>Reinos en los que guardas tus tesoros</Text>
          </View>
          <Image
            source={require('@/assets/images/realm-marker.png')}
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
          placeholder="Buscar por nombre del realm..."
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
              {realmsToShow.length} realm{realmsToShow.length !== 1 ? 's' : ''} found
            </Text>
            <TouchableOpacity onPress={handleClearSearch}>
              <Text style={styles.clearFiltersText}>Limpiar filtro</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {realmsToShow.length > 0 ? (
        <FlatList
          data={realmsToShow}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id || Math.random().toString()}
          contentContainerStyle={{
            marginHorizontal: theme.spacing.m,
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
                ? 'No se encontraron realms con esos criterios'
                : 'No tienes realms todavía'
            }
            actionLabel={hasActiveSearch ? 'Limpiar búsqueda' : 'Crear nuevo realm'}
            onAction={hasActiveSearch ? handleClearSearch : handleCreateRealm}
          />
        </View>
      )}

      <FloatingActionButton onPress={handleCreateRealm} icon="add" />
    </SafeAreaView>
  );
}
