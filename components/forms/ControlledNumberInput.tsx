import React from 'react';
import { useFormContext, Controller, Path } from 'react-hook-form';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';

import { TextInput } from '@/components/atoms/TextInput';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/ControlledNumberInput.styles';

interface ControlledNumberInputProps<T extends object> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const ControlledNumberInput = <T extends object>({
  name,
  label,
  placeholder,
  disabled,
  style,
  textStyle,
}: ControlledNumberInputProps<T>) => {
  const { control } = useFormContext<T>();
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={[styles.container, style]}>
          <TextInput
            label={label}
            value={value !== undefined && value !== null ? String(value) : ''}
            onChangeText={(text) =>
              onChange(text === '' ? undefined : Number(text.replace(/[^\d.-]/g, '')))
            }
            placeholder={placeholder}
            disabled={disabled}
            error={error?.message}
            style={textStyle}
            keyboardType="numeric"
          />
        </View>
      )}
    />
  );
};
