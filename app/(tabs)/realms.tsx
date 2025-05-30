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

import { createStyles } from './styles/realms.style';

import type { Tables } from '@/types/supabase';

type Tag = Tables<'tags'>;
type RealmWithTags = Tables<'locations'> & { tags: Tag[] };

function RealmCardWithImage({ realm }: { realm: RealmWithTags }) {
  const { data: imageUrl } = useRealmPrimaryImageUrl(realm.id);
  return (
    <RealmCard
      realm={{
        ...realm,
        imageUrl,
        tags: realm.tags,
      }}
    />
  );
}

export default function RealmsScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);
  const { user } = useAuth();

  const { data: realmsFromApi = [], isLoading, isError, refetch } = useRealmsQuery(user?.id || '');

  const realms: RealmWithTags[] = realmsFromApi as RealmWithTags[];

  const handleCreateRealm = () => {
    router.push('/(modals)/realm-form');
  };

  const handleRetry = () => {
    refetch();
  };

  const renderItem = ({ item }: { item: RealmWithTags }) => <RealmCardWithImage realm={item} />;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <EmptyState
          message="Ocurrió un error al cargar los reinos."
          actionLabel="Reintentar"
          onAction={handleRetry}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Reinos</Text>
        <Text style={styles.headerSubtitle}>Lugares donde guardas tus tesoros</Text>
      </View>

      {realms.length > 0 ? (
        <FlatList
          data={realms}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: 32,
            minHeight: '100%', // fuerza scroll aunque haya pocos elementos
          }}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            message="No tienes reinos todavía"
            actionLabel="Crear nuevo reino"
            onAction={handleCreateRealm}
          />
        </View>
      )}

      <FloatingActionButton onPress={handleCreateRealm} icon="add" />
    </SafeAreaView>
  );
}
