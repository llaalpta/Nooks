import React from 'react';
import { View } from 'react-native';

import { Spinner } from '@/components/atoms/Spinner';
import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/LoadingScreen.styles';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Cargando...' }: LoadingScreenProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);

  return (
    <View style={styles.container}>
      <Spinner size="large" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
