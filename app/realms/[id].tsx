import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/common/EmptyState';
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

import { createStyles } from './styles/details.style';

import type { Tables } from '@/types/supabase';

type Nook = Tables<'locations'>;
type Tag = Tables<'tags'>;

export default function RealmDetailScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);
  const params = useLocalSearchParams<{ id: string }>();
  const realmId = params.id;
  const { user } = useAuth();
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

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

  const deleteMutation = useDeleteRealmMutation();

  const handleEditRealm = () => {
    setShowOptionsMenu(false);
    router.push({
      pathname: '/(modals)/realm-form',
      params: { id: realmId },
    });
  };

  const handleDeleteRealm = async () => {
    setShowOptionsMenu(false);

    Alert.alert('Eliminar Reino', '¿Estás seguro de que quieres eliminar este reino?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            const hasChildren = await hasNooks(realmId);
            if (hasChildren) {
              Alert.alert(
                'No se puede eliminar',
                'Este reino contiene nooks. Elimina los nooks primero antes de eliminar el reino.'
              );
              return;
            }

            await deleteMutation.mutateAsync(realmId);
            Alert.alert('Éxito', 'Reino eliminado con éxito');
            router.back();
          } catch (error: any) {
            Alert.alert('Error', error?.message || 'No se pudo eliminar el reino');
          }
        },
      },
    ]);
  };

  const handleCreateNook = () => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para realizar esta acción');
      return;
    }
    router.push({
      pathname: '/(modals)/nook-form',
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

  if (isLoadingRealm || isLoadingNooks) {
    return <LoadingScreen />;
  }

  if (isErrorRealm || !realm) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <EmptyState
          message="No se pudo cargar el reino"
          actionLabel="Volver"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: 220 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: '100%',
            height: 220,
            backgroundColor: theme.colors.surfaceVariant,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="image-outline" size={64} color={theme.colors.outlineVariant} />
          <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
            Sin imagen principal
          </Text>
        </View>
      )}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>{realm.name}</Text>
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={() => setShowOptionsMenu(!showOptionsMenu)}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.onSurface} />
          </TouchableOpacity>
        </View>
        {showOptionsMenu && (
          <View style={styles.optionsMenu}>
            <TouchableOpacity style={styles.optionItem} onPress={handleEditRealm}>
              <Ionicons name="pencil-outline" size={18} color={theme.colors.primary} />
              <Text style={styles.optionText}>Editar reino</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem} onPress={handleDeleteRealm}>
              <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
              <Text style={[styles.optionText, { color: theme.colors.error }]}>Eliminar reino</Text>
            </TouchableOpacity>
          </View>
        )}
        {realm.description && <Text style={styles.description}>{realm.description}</Text>}
        {realm.latitude && realm.longitude && (
          <Text style={styles.location}>
            Ubicación: {realm.latitude.toFixed(5)}, {realm.longitude.toFixed(5)}
            {realm.radius && ` • Radio: ${realm.radius.toFixed(0)}m`}
          </Text>
        )}
        {/* Mostrar tags como chips de color */}
        {Array.isArray((realm as any).tags) && (realm as any).tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {(realm as any).tags.map((tag: Tag) => (
              <View
                key={tag.id}
                style={[styles.tag, tag.color ? { backgroundColor: tag.color } : null]}
              >
                <Text style={styles.tagText}>{tag.name}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nooks</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateNook}>
          <Ionicons name="add" size={18} color={theme.colors.primary} />
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
      {isErrorNooks ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se pudieron cargar los nooks de este reino.</Text>
          <Button mode="contained" onPress={() => router.replace(`/realms/${realmId}`)}>
            Reintentar
          </Button>
        </View>
      ) : nooks.length > 0 ? (
        <FlatList
          data={nooks}
          renderItem={renderNookItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay nooks en este reino. ¡Crea el primero!</Text>
          <Button mode="contained" onPress={handleCreateNook}>
            Crear Nook
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}
