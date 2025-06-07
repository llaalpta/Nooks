// components/forms/ControlledImagePicker.tsx - Versión mejorada compatible
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { useFormContext, Controller, Path } from 'react-hook-form';
import { StyleProp, ViewStyle, View, TouchableOpacity, Image } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/ControlledImagePicker.styles';

interface ControlledImagePickerProps<T extends object> {
  name: Path<T>;
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onImageChange?: (localUri: string) => void;
  aspectRatio?: number; // Añadido para flexibilidad
}

export const ControlledImagePicker = <T extends object>({
  name,
  label,
  disabled,
  style,
  onImageChange,
  aspectRatio = 16 / 9, // Por defecto 16:9
}: ControlledImagePickerProps<T>) => {
  const { control } = useFormContext<T>();
  const theme = useAppTheme();
  const styles = createStyles(theme);

  // Lógica para abrir galería o cámara
  const pickImageFromLibrary = async (onChange: (uri: string) => void) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: false, // No crop, subida directa
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        let imageUri = result.assets[0].uri;
        try {
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            imageUri,
            [
              {
                resize: {
                  width: 400,
                  height: Math.round(400 / aspectRatio),
                },
              },
            ],
            {
              compress: 0.8,
              format: ImageManipulator.SaveFormat.JPEG,
            }
          );
          imageUri = manipulatedImage.uri;
        } catch (manipError) {
          console.warn('Error optimizando imagen, usando original:', manipError);
        }
        onChange(imageUri);
        if (onImageChange) onImageChange(imageUri);
      }
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
    }
  };

  const takePhoto = async (onChange: (uri: string) => void) => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: false, // No crop, subida directa
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        let imageUri = result.assets[0].uri;
        try {
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            imageUri,
            [
              {
                resize: {
                  width: 400,
                  height: Math.round(400 / aspectRatio),
                },
              },
            ],
            {
              compress: 0.8,
              format: ImageManipulator.SaveFormat.JPEG,
            }
          );
          imageUri = manipulatedImage.uri;
        } catch (manipError) {
          console.warn('Error optimizando imagen, usando original:', manipError);
        }
        onChange(imageUri);
        if (onImageChange) onImageChange(imageUri);
      }
    } catch (error) {
      console.error('Error tomando foto:', error);
    }
  };

  // ActionSheet cross-platform
  const { showActionSheetWithOptions } = useActionSheet();
  const handleImagePickerPress = (onChange: (uri: string) => void) => {
    const options = ['Cancelar', 'Tomar foto', 'Elegir de galería'];
    const cancelButtonIndex = 0;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex: number | undefined) => {
        if (buttonIndex === 1) {
          takePhoto(onChange);
        } else if (buttonIndex === 2) {
          pickImageFromLibrary(onChange);
        }
      }
    );
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={[styles.container, { width: '100%' }, style]}>
          {label && <Text style={styles.label}>{label}</Text>}

          <View style={[styles.imageContainer, { width: '100%' }]}>
            {value ? (
              // Imagen seleccionada
              <View style={[styles.imagePreview, { width: '100%' }]}>
                <Image
                  source={{ uri: value }}
                  style={[styles.image, { aspectRatio, width: '100%' }]}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.imageOverlay}
                  onPress={() => handleImagePickerPress(onChange)}
                  disabled={disabled}
                >
                  <Ionicons name="pencil" size={16} color={theme.colors.onSurface} />
                </TouchableOpacity>
              </View>
            ) : (
              // Placeholder cuando no hay imagen
              <TouchableOpacity
                style={[styles.placeholderContainer, { aspectRatio, width: '100%' }]}
                onPress={() => handleImagePickerPress(onChange)}
                disabled={disabled}
              >
                <View style={styles.placeholderContent}>
                  <Ionicons
                    name="image-outline"
                    size={32}
                    color={theme.colors.onSurfaceVariant}
                    style={styles.placeholderIcon}
                  />
                  <Text style={styles.placeholderText}>Toca para seleccionar imagen</Text>
                  <Text
                    style={[
                      styles.placeholderText,
                      {
                        fontSize: 12,
                        opacity: 0.7,
                        marginBottom: 0,
                      },
                    ]}
                  >
                    Formato: {aspectRatio.toFixed(1)}:1
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {error && <Text style={styles.errorText}>{error?.message}</Text>}
        </View>
      )}
    />
  );
};
