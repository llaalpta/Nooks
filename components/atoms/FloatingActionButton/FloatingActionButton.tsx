import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './FloatingActionButton.styles';

export interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function FloatingActionButton({
  onPress,
  icon = 'add',
  color,
  style,
}: FloatingActionButtonProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={icon} size={24} color={color || theme.colors.onPrimary} />
    </TouchableOpacity>
  );
}
