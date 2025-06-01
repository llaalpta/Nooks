import React from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/ImageGallery.styles';

interface ImageGalleryProps {
  images: { uri: string; id?: string }[];
  onImagePress?: (uri: string, index: number) => void;
  onRemoveImage?: (id: string) => void;
  showRemove?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ImageGallery({
  images,
  onImagePress,
  onRemoveImage,
  showRemove = false,
  style,
}: ImageGalleryProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  if (!images || images.length === 0) {
    return (
      <View style={[styles.emptyContainer, style]}>
        <Text style={styles.emptyText}>No hay imágenes</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={images}
      horizontal
      keyExtractor={(item, idx) => item.id || item.uri || String(idx)}
      contentContainerStyle={styles.contentContainer}
      style={style}
      renderItem={({ item, index }) => (
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => onImagePress?.(item.uri, index)}>
            <Image source={{ uri: item.uri }} style={styles.image} />
          </TouchableOpacity>
          {showRemove && onRemoveImage && item.id && (
            <TouchableOpacity style={styles.removeButton} onPress={() => onRemoveImage(item.id!)}>
              <Text style={styles.removeIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
}
