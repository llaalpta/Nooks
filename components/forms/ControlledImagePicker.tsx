import { useActionSheet } from '@expo/react-native-action-sheet';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { useFormContext, Controller, Path } from 'react-hook-form';
import { StyleProp, ViewStyle, View, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/ControlledImagePicker.styles';

interface ControlledImagePickerProps<T extends object> {
  name: Path<T>;
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onImageChange?: (localUri: string) => void;
  aspectRatio?: number;
  avatarMode?: boolean;
  avatarSize?: number;
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
  const insets = useSafeAreaInsets();

  const pickImageFromLibrary = async (onChange: (uri: string) => void) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: avatarMode ? [1, 1] : [aspectRatio, 1],
        quality: 1.0,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        const imageUri = result.assets[0].uri;

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
        allowsEditing: true,
        aspect: avatarMode ? [1, 1] : [aspectRatio, 1],
        quality: 1.0,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        const imageUri = result.assets[0].uri;

        try {
          const targetWidth = avatarMode ? 800 : 1000;
          const targetHeight = avatarMode ? 800 : Math.round(targetWidth / aspectRatio);

          const manipulatedImage = await ImageManipulator.manipulateAsync(
            imageUri,
            [
              {
                resize: {
                  width: targetWidth,
                  height: targetHeight,
                },
              },
            ],
            {
              compress: 0.9,
              format: ImageManipulator.SaveFormat.JPEG,
            }
          );
          onChange(manipulatedImage.uri);
        } catch (manipError) {
          console.warn('Error optimizando imagen, usando original:', manipError);
          onChange(imageUri);
        }

        if (onImageChange) onImageChange(imageUri);
      }
    } catch (error) {
      console.error('Error tomando foto:', error);
    }
  };

  // ActionSheet cross-platform
  const { showActionSheetWithOptions } = useActionSheet();
  const handleImagePickerPress = (onChange: (uri: string) => void, currentValue?: string) => {
    const options = currentValue
      ? ['Cancelar', 'Usar cámara', 'Elegir de la galería', 'Eliminar foto']
      : ['Cancelar', 'Usar cámara', 'Elegir de la galería'];
    const cancelButtonIndex = 0;
    const deleteButtonIndex = currentValue ? 3 : -1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex: deleteButtonIndex !== -1 ? deleteButtonIndex : undefined,
        containerStyle: {
          paddingBottom: insets.bottom,
          backgroundColor: theme.colors.surfaceContainerHigh,
          borderTopLeftRadius: theme.borderRadius.l,
          borderTopRightRadius: theme.borderRadius.l,
        },
        textStyle: {
          color: theme.colors.onSurface,
          fontSize: 16,
          fontWeight: '500',
        },
        titleTextStyle: {
          color: theme.colors.onSurfaceVariant,
          fontSize: 14,
        },
        destructiveColor: theme.colors.error,
        separatorStyle: {
          backgroundColor: theme.colors.outlineVariant,
        },
        showSeparators: true,
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
                    : [
                        styles.placeholderContainer,
                        { aspectRatio, width: '100%', overflow: 'hidden' },
                        value && {
                          borderWidth: 3,
                          borderStyle: 'solid',
                          borderColor: theme.colors.primary,
                        },
                      ]
                }
                onPress={() => handleImagePickerPress(onChange, value)}
                disabled={disabled}
                activeOpacity={0.8}
              >
                {value ? (
                  <Image
                    source={{ uri: value }}
                    style={{
                      width: '100%',
                      height: '100%',
                      ...(avatarMode ? { borderRadius: avatarSize / 2 } : { borderRadius: 0 }),
                    }}
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
            </View>
          </View>

          {error && <Text style={styles.errorText}>{error?.message}</Text>}
        </View>
      )}
    />
  );
};
