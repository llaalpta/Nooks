import React from 'react';
import { useFormContext, Controller, Path } from 'react-hook-form';
import { StyleProp, View, ViewStyle, TextStyle } from 'react-native';

import { TextInput, TextInputProps } from '@/components/atoms/TextInput';

interface ControlledTextInputProps<T extends object>
  extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  name: Path<T>;
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const ControlledTextInput = <T extends object>({
  name,
  label,
  placeholder,
  disabled,
  containerStyle,
  textStyle,
  autoCapitalize,
  secureTextEntry,
  keyboardType,
  ...props
}: ControlledTextInputProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={containerStyle}>
          <TextInput
            label={label}
            value={String(value || '')}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            error={error?.message}
            style={textStyle}
            autoCapitalize={autoCapitalize}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            {...props}
          />
        </View>
      )}
    />
  );
};
