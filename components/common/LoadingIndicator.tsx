import React from 'react';
import { View, ViewStyle } from 'react-native';

import { Spinner } from '@/components/atoms/Spinner';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/LoadingIndicator.styles';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  style?: ViewStyle;
}

export function LoadingIndicator({ size = 'large', style }: LoadingIndicatorProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <Spinner size={size} />
    </View>
  );
}
