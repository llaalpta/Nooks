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
  disabled?: boolean;
}

export function TextInput({
  label,
  error,
  helperText,
  left,
  right,
  style,
  disabled,
  ...props
}: TextInputProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          focused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          disabled && styles.disabled,
        ]}
      >
        {left && <View style={styles.leftIcon}>{left}</View>}

        <RNTextInput
          style={[styles.input, style]}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={!disabled}
          {...props}
        />

        {right && <View style={styles.rightIcon}>{right}</View>}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}
