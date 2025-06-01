import React from 'react';
import { View } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/EmptyState.styles';

interface EmptyStateProps {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  message = 'No hay datos para mostrar.',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <Button mode="contained" onPress={onAction}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}
