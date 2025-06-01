import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { useFormContext, Controller, Path } from 'react-hook-form';
import { StyleProp, View, ViewStyle, Image } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/ControlledImagePicker.styles';

interface ControlledImagePickerProps<T extends object> {
  name: Path<T>;
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onImageChange?: (localUri: string) => void;
}

export const ControlledImagePicker = <T extends object>({
  name,
  label,
  disabled,
  style,
  onImageChange,
}: ControlledImagePickerProps<T>) => {
  const { control } = useFormContext<T>();
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const pickImage = async (onChange: (uri: string) => void) => {
    // Usamos 'image/*' como tipo de medio para evitar la advertencia de MediaTypeOptions
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      onChange(result.assets[0].uri);
      if (onImageChange) onImageChange(result.assets[0].uri);
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={[styles.container, style]}>
          {label && <Text style={styles.label}>{label}</Text>}
          {value ? <Image source={{ uri: value }} style={styles.image} /> : null}
          <Button mode="outlined" onPress={() => pickImage(onChange)} disabled={disabled}>
            {value ? 'Cambiar imagen' : 'Seleccionar imagen'}
          </Button>
          {error && <Text style={styles.errorText}>{error?.message}</Text>}
        </View>
      )}
    />
  );
};
