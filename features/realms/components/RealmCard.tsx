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
}

export function RealmCard({ realm }: RealmCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const handlePress = () => {
    router.push(`/realms/${realm.id}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.85}>
      <View style={styles.cardHorizontalContainer}>
        {/* Imagen a la izquierda */}
        <View style={styles.imageContainer}>
          {realm.imageUrl ? (
            <Image
              source={{ uri: realm.imageUrl }}
              style={styles.horizontalImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.horizontalPlaceholder}>
              <Ionicons name="image-outline" size={24} color={theme.colors.outlineVariant} />
            </View>
          )}
        </View>

        {/* Contenido a la derecha */}
        <View style={styles.cardContent}>
          <Text style={styles.title}>{realm.name}</Text>
          {realm.description && (
            <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
              {realm.description}
            </Text>
          )}
          {/* Mostrar información de ubicación y radio */}
          {realm.latitude && realm.longitude && (
            <Text style={styles.locationInfo} numberOfLines={1} ellipsizeMode="tail">
              📍 {realm.latitude.toFixed(4)}, {realm.longitude.toFixed(4)}
              {realm.radius && ` • ${realm.radius.toFixed(0)}m de radio`}
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
      </View>
    </TouchableOpacity>
  );
}

