import { router } from 'expo-router';
import React from 'react';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingActionButton } from '@/components/atoms/FloatingActionButton';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/common/EmptyState';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { RealmCard } from '@/features/realms/components/RealmCard';
import { useRealmsQuery, useRealmPrimaryImageUrl } from '@/features/realms/hooks';
import { createStyles } from '@/styles/app/tabs/realms.style';

import type { Tables } from '@/types/supabase';

type Tag = Tables<'tags'>;
type RealmWithTags = Tables<'locations'> & { tags: Tag[] };

function RealmCardWithImage({ realm }: { realm: RealmWithTags }) {
  const { data: imageUrl } = useRealmPrimaryImageUrl(realm.id);

  // 🔥 Validación adicional antes de renderizar
  if (!realm || !realm.id) {
    return null;
  }

  return (
    <RealmCard
      realm={{
        ...realm,
        imageUrl,
        tags: Array.isArray(realm.tags) ? realm.tags : [], // 🔥 Garantizar que tags es un array
      }}
    />
  );
}

export default function RealmsScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { user } = useAuth();

  const { data: realmsFromApi = [], isLoading, isError, refetch } = useRealmsQuery(user?.id || '');

  // 🔥 Filtrar realms válidos y añadir validaciones
  const realms: RealmWithTags[] = (realmsFromApi as RealmWithTags[]).filter((realm) => {
    // Validar que el realm tenga los campos mínimos necesarios
    return (
      realm &&
      realm.id &&
      typeof realm.id === 'string' &&
      realm.name !== null &&
      realm.name !== undefined
    );
  });

  const handleCreateRealm = () => {
    router.push({ pathname: '/realms/realm-form', params: { from: 'list' } });
  };

  const handleRetry = () => {
    refetch();
  };

  const renderItem = ({ item }: { item: RealmWithTags }) => {
    // 🔥 Validación adicional en el render
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
      <SafeAreaView style={styles.container} edges={['top']}>
        <EmptyState
          message="Ocurrió un error al cargar los realms."
          actionLabel="Reintentar"
          onAction={handleRetry}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Realms</Text>
        <Text style={styles.headerSubtitle}>Reinos donde guardas tus tesoros</Text>
      </View>

      {realms.length > 0 ? (
        <FlatList
          data={realms}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id || Math.random().toString()} // 🔥 Fallback para keyExtractor
          contentContainerStyle={{
            marginHorizontal: 8,
            paddingTop: 10,
            gap: 10,
            paddingBottom: 85,
            minHeight: '100%',
          }}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          // 🔥 Propiedades adicionales para manejar errores
          removeClippedSubviews={false}
          initialNumToRender={10}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            message="No tienes realms todavía"
            actionLabel="Crear nuevo realm"
            onAction={handleCreateRealm}
          />
        </View>
      )}

      <FloatingActionButton onPress={handleCreateRealm} icon="add" />
    </SafeAreaView>
  );
}
