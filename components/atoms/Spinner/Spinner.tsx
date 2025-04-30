import React from 'react';
import { ActivityIndicator, View, ViewStyle } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './Spinner.styles';

export interface SpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

export function Spinner({ size = 'large', color, style }: SpinnerProps) {
  const theme = useAppTheme();
  const styles = createStyles();

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color || theme.colors.primary} />
    </View>
  );
}
