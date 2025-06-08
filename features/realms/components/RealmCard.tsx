import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';
import { formatArea } from '@/utils/realmUtils';

import { createStyles } from './styles/RealmCard.styles';

import type { Tables } from '@/types/supabase';

// Definición de Tag según la tabla tags
type Tag = Tables<'tags'>;

export interface RealmCardProps {
  realm: Tables<'locations'> & { imageUrl?: string | null; tags: Tag[]; nooksCount?: number };
}

export function RealmCard({ realm }: RealmCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  // 🔥 Validación temprana - igual que NookCard
  if (!realm || !realm.id) {
    return null;
  }

  const handlePress = () => {
    router.push(`/realms/${realm.id}`);
  };

  // Configuración para el cálculo de espacio
  const CHARS_PER_LINE = 25; // Aproximación de caracteres que caben por línea
  const COUNTER_CHARS = 4; // Espacio reservado para "+N" (ej: "+10")

  // Función para calcular distribución de tags en 2 líneas
  const calculateTagDistribution = () => {
    if (!Array.isArray(realm.tags) || realm.tags.length === 0) return [];

    const lines: { tagIndices: number[]; shouldTruncateLast: boolean }[] = [
      { tagIndices: [], shouldTruncateLast: false },
      { tagIndices: [], shouldTruncateLast: false },
    ];

    let currentLine = 0;
    let currentLineChars = 0;

    for (let i = 0; i < realm.tags.length && currentLine < 2; i++) {
      const tag = realm.tags[i];
      // 🔥 VALIDACIÓN: Asegurar que el tag tiene nombre
      if (!tag || !tag.name || typeof tag.name !== 'string') continue;

      const tagLength = tag.name.length;
      const spaceNeeded = tagLength + (lines[currentLine].tagIndices.length > 0 ? 2 : 0); // +2 para espaciado entre tags

      // En la segunda línea, verificar si hay más tags después de este
      const isLastLine = currentLine === 1;
      const hasRemainingTags = i < realm.tags.length - 1;
      const counterSpace = isLastLine && hasRemainingTags ? COUNTER_CHARS + 2 : 0;

      // Verificar si el tag cabe en la línea actual
      if (currentLineChars + spaceNeeded + counterSpace <= CHARS_PER_LINE) {
        lines[currentLine].tagIndices.push(i);
        currentLineChars += spaceNeeded;
      } else if (isLastLine && hasRemainingTags) {
        // Si estamos en la última línea y hay más tags, verificar si podemos truncar
        const minSpaceForTag = 8; // Mínimo espacio para mostrar algo del tag
        const availableSpace = CHARS_PER_LINE - currentLineChars - counterSpace - 2; // -2 para espaciado

        if (availableSpace >= minSpaceForTag) {
          lines[currentLine].tagIndices.push(i);
          lines[currentLine].shouldTruncateLast = true;
          break; // No agregar más tags
        } else {
          break; // No hay espacio suficiente
        }
      } else {
        // Pasar a la siguiente línea
        currentLine++;
        if (currentLine < 2) {
          lines[currentLine].tagIndices.push(i);
          currentLineChars = tagLength;
        } else {
          break; // No caben más líneas
        }
      }
    }

    return lines;
  };

  // Renderizar una línea específica de tags
  const renderTagLine = (
    lineIndex: number,
    lineData: { tagIndices: number[]; shouldTruncateLast: boolean }
  ) => {
    if (lineData.tagIndices.length === 0) return null;

    const { tagIndices, shouldTruncateLast } = lineData;
    const isLastLine = lineIndex === 1;
    const totalTagsShown = tagIndices[tagIndices.length - 1] + 1;
    const remainingTags = realm.tags.length - totalTagsShown;
    const shouldShowCounter = isLastLine && remainingTags > 0;

    return (
      <View style={styles.tagLine} key={`line-${lineIndex}`}>
        {tagIndices.map((tagIndex, idx) => {
          const tag = realm.tags[tagIndex];
          // 🔥 VALIDACIÓN: Verificar que el tag existe y tiene nombre
          if (!tag || !tag.name || typeof tag.name !== 'string') return null;

          const isLastTagInLine = idx === tagIndices.length - 1;
          const shouldTruncateThis = isLastTagInLine && shouldTruncateLast;

          return (
            <View
              key={tag.id || `tag-${tagIndex}`} // 🔥 Fallback para key
              style={[
                styles.tag,
                // Solo usar tagEllipsized si realmente necesitamos truncar
                shouldTruncateThis ? styles.tagEllipsized : null,
                tag.color ? { backgroundColor: tag.color } : null,
              ]}
            >
              <Text
                style={styles.tagText}
                numberOfLines={1}
                ellipsizeMode={shouldTruncateThis ? 'tail' : 'clip'}
              >
                {tag.name}
              </Text>
            </View>
          );
        })}

        {shouldShowCounter && (
          <View
            style={[
              styles.tag,
              styles.tagCounter,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <Text style={styles.tagText}>+{remainingTags}</Text>
          </View>
        )}
      </View>
    );
  };

  const tagLines = calculateTagDistribution();

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.95}>
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
              <Ionicons name="image-outline" size={32} color={theme.colors.onSurfaceVariant} />
            </View>
          )}

          {/* Indicador de estado público/privado */}
          {realm.is_public !== null && (
            <View style={styles.statusIndicator}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Image
                  source={require('@/assets/images/realm-marker-small.png')}
                  style={{
                    width: 32,
                    height: 32,
                  }}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}

          {/* Información de ubicación y radio */}
          {realm.latitude && realm.longitude && (
            <View style={styles.locationIndicator}>
              <Text style={styles.locationInfo} numberOfLines={1} ellipsizeMode="tail">
                {/* 🔥 Validación de tipos numéricos */}
                {typeof realm.latitude === 'number' ? realm.latitude.toFixed(6) : '0.000000'},
                {typeof realm.longitude === 'number' ? realm.longitude.toFixed(6) : '0.000000'}
              </Text>
              {/* 🔥 Validación de radius */}
              {realm.radius && typeof realm.radius === 'number' && (
                <Text style={styles.locationInfo} numberOfLines={1} ellipsizeMode="tail">
                  ◯ {formatArea(realm.radius)}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Contenido a la derecha */}
        <View style={styles.cardContent}>
          {/* CONTENIDO SUPERIOR: Título y descripción */}
          <View style={{ flex: 1 }}>
            {/* TÍTULO CON CONTADOR */}
            <View style={styles.titleWithCounterContainer}>
              <Text style={styles.titleMain} numberOfLines={1} ellipsizeMode="tail">
                {/* 🔥 Fallback para nombre - igual que NookCard */}
                {realm.name || 'Sin nombre'}
              </Text>
              {/* 🔥 Validación del contador de nooks */}
              {typeof realm.nooksCount === 'number' && realm.nooksCount > 0 && (
                <Text style={styles.titleCounter}>
                  ({realm.nooksCount} {realm.nooksCount === 1 ? 'nook' : 'nooks'})
                </Text>
              )}
            </View>

            {/* DESCRIPCIÓN - NUEVA LÍNEA */}
            {/* 🔥 Misma validación que NookCard */}
            {realm.description && String(realm.description).trim() && (
              <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
                {String(realm.description)}
              </Text>
            )}
          </View>

          {/* TAGS AL FONDO - SOLO 2 LÍNEAS */}
          {Array.isArray(realm.tags) && realm.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tagLines.map((lineData, lineIndex) => renderTagLine(lineIndex, lineData))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
