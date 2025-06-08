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
import { RealmCard } from '@/features/realms/components/RealmCard';
import { useRealmsQuery, useRealmPrimaryImageUrl } from '@/features/realms/hooks';
import { useSearchRealmsQuery } from '@/features/search/hooks'; // 🔥 Importar hook de búsqueda
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

  // 🔥 Estados para búsqueda - DOS CAMPOS SEPARADOS
  const [searchText, setSearchText] = useState('');
  const [tagSearchText, setTagSearchText] = useState('');

  // Queries principales
  const { data: realmsFromApi = [], isLoading, isError, refetch } = useRealmsQuery(user?.id || '');

  // 🔥 Query de búsqueda por nombre (solo se ejecuta cuando hay texto)
  const { data: searchResults = [] } = useSearchRealmsQuery(user?.id || '', searchText.trim());

  // 🔥 Determinar qué datos mostrar
  const realmsToShow = useMemo(() => {
    let filteredRealms: RealmWithTags[];

    // Si hay búsqueda por nombre, usar resultados de búsqueda
    if (searchText.trim()) {
      filteredRealms = searchResults as RealmWithTags[];
    } else {
      // Si no hay búsqueda por nombre, usar todos los realms
      filteredRealms = realmsFromApi as RealmWithTags[];
    }

    // 🔥 Filtrar por nombre de etiqueta (búsqueda local)
    if (tagSearchText.trim()) {
      const normalizedTagSearch = tagSearchText.toLowerCase().trim();
      filteredRealms = filteredRealms.filter((realm) => {
        if (!Array.isArray(realm.tags)) return false;
        return realm.tags.some(
          (tag) => tag.name && tag.name.toLowerCase().includes(normalizedTagSearch)
        );
      });
    }

    // Validar realms
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
      {/* Header con título */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Realms</Text>
        <Text style={styles.headerSubtitle}>Reinos donde guardas tus tesoros</Text>
      </View>

      {/* 🔥 Sección de búsqueda - DOS CAMPOS */}
      <View style={styles.searchContainer}>
        {/* Campo de búsqueda por nombre */}
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
              {realmsToShow.length} realm{realmsToShow.length !== 1 ? 's' : ''} encontrado
              {realmsToShow.length !== 1 ? 's' : ''}
            </Text>
            <TouchableOpacity onPress={handleClearSearch}>
              <Text style={styles.clearFiltersText}>Limpiar búsqueda</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Lista de realms */}
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
