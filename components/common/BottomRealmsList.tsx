import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { StyleSheet } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';
import { AppTheme } from '@/types';
import { Tables } from '@/types/supabase';
import { calculateDistance } from '@/utils/locationUtils';

type Realm = Tables<'locations'>;

interface BottomRealmsListProps {
  realms: Realm[];
  userLocation: { latitude: number; longitude: number } | null;
  onRealmSelect: (realm: Realm) => void;
  onClose: () => void;
}

const BottomRealmsList: React.FC<BottomRealmsListProps> = ({
  realms,
  userLocation,
  onRealmSelect,
  onClose,
}) => {
  const theme = useAppTheme();
  const router = useRouter();
  const styles = createStyles(theme);

  const getDistance = useCallback(
    (realm: Realm) => {
      if (!userLocation || !realm.latitude || !realm.longitude) {
        return null;
      }

      return calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        realm.latitude,
        realm.longitude
      );
    },
    [userLocation]
  );

  // Ordenar realms por distancia cuando hay ubicación de usuario
  const sortedRealms = [...realms].sort((a, b) => {
    const distanceA = getDistance(a) || Infinity;
    const distanceB = getDistance(b) || Infinity;
    return distanceA - distanceB;
  });

  const formatDistance = (distance: number | null) => {
    if (distance === null) return '—';

    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  const handleRealmPress = (realm: Realm) => {
    onRealmSelect(realm);
  };

  const handleRealmDetails = (realm: Realm) => {
    router.push(`/realms/${realm.id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.handle}>
        <View style={styles.handleBar} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Realms cercanos</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={theme.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedRealms}
        keyExtractor={(item) => item.id || 'unknown'}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.realmItem} onPress={() => handleRealmPress(item)}>
            <View style={styles.realmIconContainer}>
              <View style={styles.realmIcon}>
                <Ionicons name="map" size={22} color={theme.colors.onPrimary} />
              </View>
            </View>

            <View style={styles.realmInfo}>
              <Text style={styles.realmName}>{item.name}</Text>
              <Text style={styles.realmAddress} numberOfLines={1}>
                {item.description || 'Sin descripción'}
              </Text>
            </View>

            <View style={styles.realmActions}>
              <Text style={styles.realmDistance}>{formatDistance(getDistance(item))}</Text>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => handleRealmDetails(item)}
              >
                <Text style={styles.detailsButtonText}>DETALLES</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.l,
      borderTopRightRadius: theme.borderRadius.l,
      maxHeight: '70%',
      ...theme.elevation.level3,
    },
    handle: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xs,
    },
    handleBar: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.outlineVariant,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant,
    },
    title: {
      fontSize: 18,
      fontWeight: '500',
      color: theme.colors.onSurface,
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    listContent: {
      paddingBottom: theme.spacing.l,
    },
    realmItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.surfaceVariant,
    },
    realmIconContainer: {
      marginRight: theme.spacing.m,
    },
    realmIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    realmInfo: {
      flex: 1,
    },
    realmName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.onSurface,
      marginBottom: 4,
    },
    realmAddress: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
    realmActions: {
      alignItems: 'flex-end',
    },
    realmDistance: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    detailsButton: {
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    detailsButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.primary,
    },
  });

export default BottomRealmsList;
