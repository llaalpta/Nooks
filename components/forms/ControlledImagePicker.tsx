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
  avatarMode?: boolean; // Si es true, muestra el avatar redondo
  avatarSize?: number; // Nuevo: tamaño del avatar en px (solo avatarMode)
}

export const ControlledImagePicker = <T extends object>({
  name,
  label,
  disabled,
  style,
  onImageChange,
  aspectRatio = 16 / 9,
  avatarMode = false,
  avatarSize = 120,
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
  const handleImagePickerPress = (onChange: (uri: string) => void, currentValue?: string) => {
    // Si hay imagen, añadir opción de eliminar
    const options = currentValue
      ? ['Cancelar', 'Tomar foto', 'Elegir de galería', 'Eliminar foto']
      : ['Cancelar', 'Tomar foto', 'Elegir de galería'];
    const cancelButtonIndex = 0;
    const deleteButtonIndex = currentValue ? 3 : -1;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex: deleteButtonIndex !== -1 ? deleteButtonIndex : undefined,
      },
      (buttonIndex: number | undefined) => {
        if (buttonIndex === 1) {
          takePhoto(onChange);
        } else if (buttonIndex === 2) {
          pickImageFromLibrary(onChange);
        } else if (currentValue && buttonIndex === 3) {
          onChange('');
          if (onImageChange) onImageChange('');
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
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity
                style={
                  avatarMode
                    ? [
                        {
                          width: avatarSize,
                          height: avatarSize,
                          borderRadius: avatarSize / 2,
                          borderWidth: 4,
                          borderColor: theme.colors.primary,
                          backgroundColor: theme.colors.surfaceVariant,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 0,
                          overflow: 'hidden',
                        },
                      ]
                    : [styles.placeholderContainer, { aspectRatio, width: '100%' }]
                }
                onPress={() => handleImagePickerPress(onChange, value)}
                disabled={disabled}
                activeOpacity={0.8}
              >
                {value ? (
                  <Image
                    source={{ uri: value }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={
                      avatarMode
                        ? { alignItems: 'center', justifyContent: 'center', flex: 1 }
                        : styles.placeholderContent
                    }
                  >
                    <Ionicons
                      name={avatarMode ? 'person-circle' : 'image-outline'}
                      size={avatarMode ? 64 : 32}
                      color={theme.colors.onSurfaceVariant}
                      style={avatarMode ? undefined : styles.placeholderIcon}
                    />
                    <Text
                      style={[
                        styles.placeholderText,
                        avatarMode ? { fontSize: 14, marginTop: 4 } : {},
                      ]}
                    >
                      {avatarMode ? 'Selecciona tu avatar' : 'Toca para seleccionar imagen'}
                    </Text>
                    {!avatarMode && (
                      <Text
                        style={[
                          styles.placeholderText,
                          { fontSize: 12, opacity: 0.7, marginBottom: 0 },
                        ]}
                      >
                        Formato: {aspectRatio.toFixed(1)}:1
                      </Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
              {/* Botón eliminar foto externo eliminado. Solo opción en menú contextual. */}
            </View>
          </View>

          {error && <Text style={styles.errorText}>{error?.message}</Text>}
        </View>
      )}
    />
  );
};
