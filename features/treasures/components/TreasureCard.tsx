import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/TreasureCard.styles';

import type { Tables } from '@/types/supabase';

type Tag = Tables<'tags'>;

export interface TreasureCardProps {
  treasure: Tables<'treasures'> & { imageUrl?: string | null; tags: Tag[] };
  onPress?: () => void;
}

export function TreasureCard({ treasure, onPress }: TreasureCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({ pathname: '/treasures/[id]', params: { id: treasure.id, returnTo: 'treasures' } });
    }
  };

  // Configuración para el cálculo de espacio (mismo que RealmCard/NookCard)
  const CHARS_PER_LINE = 25;
  const COUNTER_CHARS = 4;

  // Distribución de tags en 2 líneas
  const calculateTagDistribution = () => {
    if (!Array.isArray(treasure.tags) || treasure.tags.length === 0) return [];

    const lines: { tagIndices: number[]; shouldTruncateLast: boolean }[] = [
      { tagIndices: [], shouldTruncateLast: false },
      { tagIndices: [], shouldTruncateLast: false },
    ];

    let currentLine = 0;
    let currentLineChars = 0;

    for (let i = 0; i < treasure.tags.length && currentLine < 2; i++) {
      const tag = treasure.tags[i];
      // VALIDACIÓN: Asegurar que el tag tiene nombre
      if (!tag || !tag.name || typeof tag.name !== 'string') continue;

      const tagLength = tag.name.length;
      const spaceNeeded = tagLength + (lines[currentLine].tagIndices.length > 0 ? 2 : 0);

      const isLastLine = currentLine === 1;
      const hasRemainingTags = i < treasure.tags.length - 1;
      const counterSpace = isLastLine && hasRemainingTags ? COUNTER_CHARS + 2 : 0;

      if (currentLineChars + spaceNeeded + counterSpace <= CHARS_PER_LINE) {
        lines[currentLine].tagIndices.push(i);
        currentLineChars += spaceNeeded;
      } else if (isLastLine && hasRemainingTags) {
        const minSpaceForTag = 8;
        const availableSpace = CHARS_PER_LINE - currentLineChars - counterSpace - 2;

        if (availableSpace >= minSpaceForTag) {
          lines[currentLine].tagIndices.push(i);
          lines[currentLine].shouldTruncateLast = true;
          break;
        } else {
          break;
        }
      } else {
        currentLine++;
        if (currentLine < 2) {
          lines[currentLine].tagIndices.push(i);
          currentLineChars = tagLength;
        } else {
          break;
        }
      }
    }

    return lines;
  };

  const renderTagLine = (
    lineIndex: number,
    lineData: { tagIndices: number[]; shouldTruncateLast: boolean }
  ) => {
    if (lineData.tagIndices.length === 0) return null;

    const { tagIndices, shouldTruncateLast } = lineData;
    const isLastLine = lineIndex === 1;
    const totalTagsShown = tagIndices[tagIndices.length - 1] + 1;
    const remainingTags = treasure.tags.length - totalTagsShown;
    const shouldShowCounter = isLastLine && remainingTags > 0;

    return (
      <View style={styles.tagLine} key={`line-${lineIndex}`}>
        {tagIndices.map((tagIndex, idx) => {
          const tag = treasure.tags[tagIndex];
          // VALIDACIÓN: Verificar que el tag existe y tiene nombre
          if (!tag || !tag.name || typeof tag.name !== 'string') return null;

          const isLastTagInLine = idx === tagIndices.length - 1;
          const shouldTruncateThis = isLastTagInLine && shouldTruncateLast;

          return (
            <View
              key={tag.id || `tag-${tagIndex}`}
              style={[
                styles.tag,
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
          {treasure.imageUrl ? (
            <Image
              source={{ uri: treasure.imageUrl }}
              style={styles.horizontalImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.horizontalPlaceholder}>
              <Ionicons name="diamond-outline" size={32} color={theme.colors.onSurfaceVariant} />
            </View>
          )}
          {/* Indicador de estado público/privado
          {treasure.is_public !== null && (
            <View style={styles.statusIndicator}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name={treasure.is_public ? 'eye-outline' : 'eye-off-outline'}
                  size={16}
                  color={theme.colors.onSurface}
                />
              </View>
            </View>
          )} */}
          {/* Información de fecha de almacenamiento */}
          {treasure.stored_at && (
            <View style={styles.dateIndicator}>
              <Text style={styles.dateInfo} numberOfLines={1} ellipsizeMode="tail">
                {new Date(treasure.stored_at).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {/* Contenido a la derecha */}
        <View style={styles.cardContent}>
          {/* CONTENIDO SUPERIOR: Título y descripción */}
          <View style={{ flex: 1 }}>
            {/* TÍTULO SIN CONTADOR (los treasures no tienen contadores) */}
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {treasure.name || 'Sin nombre'}
              </Text>
            </View>

            {/* DESCRIPCIÓN */}
            {treasure.description && String(treasure.description).trim() && (
              <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
                {String(treasure.description)}
              </Text>
            )}
          </View>

          {/* TAGS AL FONDO - SOLO 2 LÍNEAS */}
          {Array.isArray(treasure.tags) && treasure.tags.length > 0 && (
            <>
              <Text
                style={{ marginTop: theme.spacing.s, color: theme.colors.primary }}
                variant="titleSmall"
              ></Text>
              <View style={styles.tagsContainer}>
                {tagLines.map((lineData, lineIndex) => renderTagLine(lineIndex, lineData))}
              </View>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
