import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './Button.styles';

export type ButtonMode = 'contained' | 'outlined' | 'text';

export interface ButtonProps {
  mode?: ButtonMode;
  onPress?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: any;
  labelStyle?: any;
  testID?: string;
}

export function Button({
  mode = 'contained',
  onPress,
  children,
  disabled = false,
  loading = false,
  icon,
  style,
  labelStyle,
  testID,
}: ButtonProps) {
  // Ahora usamos nuestro hook personalizado para obtener el tema completo
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const buttonStyles = [styles.button, styles[mode], disabled && styles.disabled, style];

  const labelModeStyle =
    `label${mode.charAt(0).toUpperCase() + mode.slice(1)}` as keyof typeof styles;
  const labelStyles = [
    styles.label,
    styles[labelModeStyle],
    disabled && styles.labelDisabled,
    labelStyle,
  ];
  return (
    <Pressable
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={mode === 'contained' ? theme.colors.onPrimary : theme.colors.primary}
          style={styles.loading}
        />
      )}

      {icon && !loading && (
        <View style={styles.icon}>
          {typeof icon === 'string' ? <Text style={labelStyles}>{icon}</Text> : icon}
        </View>
      )}

      {typeof children === 'string' ? <Text style={labelStyles}>{children}</Text> : children}
    </Pressable>
  );
}
