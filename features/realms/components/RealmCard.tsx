import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/RealmCard.styles';

import type { Tables } from '@/types/supabase';

// Definición de Tag según la tabla tags
type Tag = Tables<'tags'>;

export interface RealmCardProps {
  realm: Tables<'locations'> & { imageUrl?: string | null; tags: Tag[] };
  onEdit?: (realm: Tables<'locations'>) => void;
  onDelete?: (realm: Tables<'locations'>) => void;
}

export function RealmCard({ realm, onEdit, onDelete }: RealmCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);

  // Depuración: mostrar los tags en consola
  console.log('TAGS EN CARD', realm.tags);

  const handlePress = () => {
    router.push(`/realms/${realm.id}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.85}>
      {realm.imageUrl ? (
        <Image
          source={{ uri: realm.imageUrl }}
          style={{ width: '100%', height: 140, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: '100%',
            height: 140,
            backgroundColor: theme.colors.surfaceVariant,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="image-outline" size={40} color={theme.colors.outlineVariant} />
          <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 4, fontSize: 12 }}>
            Sin imagen
          </Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.title}>{realm.name}</Text>
        {realm.description && (
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {realm.description}
          </Text>
        )}
        {/* Mostrar tags como chips de color */}
        {Array.isArray(realm.tags) && realm.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {realm.tags.map((tag) => (
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
      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity
              onPress={() => onEdit(realm)}
              style={{ padding: 8 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="pencil-outline" size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(realm)}
              style={{ padding: 8, marginLeft: 8 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
