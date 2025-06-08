import React, { ReactNode, useState } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  Text,
} from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './TextInput.styles';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  left?: ReactNode;
  right?: ReactNode;
  rightElement?: ReactNode; // 🔥 Nueva prop
  disabled?: boolean;
}

export function TextInput({
  label,
  error,
  helperText,
  left,
  right,
  rightElement, // 🔥 Nueva prop
  style,
  disabled,
  multiline,
  numberOfLines,
  ...props
}: TextInputProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [focused, setFocused] = useState(false);

  // 🔥 Determinar qué elemento usar a la derecha (prioridad: rightElement > right)
  const rightContent = rightElement || right;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          multiline && styles.inputContainerMultiline,
          focused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          disabled && styles.disabled,
        ]}
      >
        {left && <View style={styles.leftIcon}>{left}</View>}

        <RNTextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            multiline && numberOfLines && numberOfLines > 0
              ? { height: numberOfLines * 20 + 24 }
              : undefined,
            style,
          ]}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />

        {/* 🔥 Usa rightContent en lugar de right directamente */}
        {rightContent && <View style={styles.rightIcon}>{rightContent}</View>}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}
