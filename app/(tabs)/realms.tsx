import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, FlatList } from 'react-native';

import { FloatingActionButton } from '@/components/atoms/FloatingActionButton';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/common/EmptyState';
import { FeedbackSnackbar } from '@/components/common/FeedbackSnackbar';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { hasNooks } from '@/features/realms/api';
import { RealmCard } from '@/features/realms/components/RealmCard';
import {
  useRealmsQuery,
  useDeleteRealmMutation,
  useRealmPrimaryImageUrl,
} from '@/features/realms/hooks';

import { createStyles } from './styles/realms.styles';

import type { Tables } from '@/types/supabase';

type Tag = Tables<'tags'>;
type RealmWithTags = Tables<'locations'> & { tags: Tag[] };

function RealmCardWithImage({
  realm,
  onEdit,
  onDelete,
}: {
  realm: RealmWithTags;
  onEdit: (realm: Tables<'locations'>) => void;
  onDelete: (realm: Tables<'locations'>) => void;
}) {
  const { data: imageUrl } = useRealmPrimaryImageUrl(realm.id);
  return (
    <RealmCard
      realm={{
        ...realm,
        imageUrl,
        tags: realm.tags,
      }}
      onEdit={() => onEdit(realm)}
      onDelete={() => onDelete(realm)}
    />
  );
}

export default function RealmsScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);
  const { user } = useAuth();
  const [isCheckingNooks, setIsCheckingNooks] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
  });

  const { data: realmsFromApi = [], isLoading, isError, refetch } = useRealmsQuery(user?.id || '');

  const realms: RealmWithTags[] = realmsFromApi as RealmWithTags[];

  const deleteMutation = useDeleteRealmMutation();

  const handleCreateRealm = () => {
    router.push('/(modals)/realm-form');
  };

  const handleEditRealm = (realm: Tables<'locations'>) => {
    router.push({
      pathname: '/(modals)/realm-form',
      params: { id: realm.id },
    });
  };

  const handleDeleteRealm = async (realm: Tables<'locations'>) => {
    if (isCheckingNooks || deleteMutation.isPending) return;
    setIsCheckingNooks(true);
    try {
      const hasChildren = await hasNooks(realm.id);
      if (hasChildren) {
        setSnackbar({
          visible: true,
          message:
            'Este reino contiene nooks. Elimina los nooks primero antes de eliminar el reino.',
          type: 'info',
        });
      } else {
        try {
          await deleteMutation.mutateAsync(realm.id);
          setSnackbar({
            visible: true,
            message: 'Reino eliminado con éxito',
            type: 'success',
          });
        } catch (err) {
          const error = err as Error;
          setSnackbar({
            visible: true,
            message: error?.message || 'No se pudo eliminar el reino. Inténtalo de nuevo.',
            type: 'error',
          });
        }
      }
    } catch (err) {
      const error = err as Error;
      setSnackbar({
        visible: true,
        message:
          error?.message || 'No se pudo verificar si el reino tiene nooks. Inténtalo de nuevo.',
        type: 'error',
      });
    } finally {
      setIsCheckingNooks(false);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  const renderItem = ({ item }: { item: RealmWithTags }) => (
    <RealmCardWithImage realm={item} onEdit={handleEditRealm} onDelete={handleDeleteRealm} />
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <EmptyState
          message="Ocurrió un error al cargar los reinos."
          actionLabel="Reintentar"
          onAction={handleRetry}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            padding: 16,
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

      <FeedbackSnackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        message={snackbar.message}
        type={snackbar.type}
      />
    </View>
  );
}
