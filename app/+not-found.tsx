import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';
import { createStyles } from '@/styles/app/not-found.style';

export default function NotFoundScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.message}>¡Ups! La página que estás buscando no existe.</Text>

      <Button mode="contained" onPress={() => router.navigate('/')}>
        Volver al inicio
      </Button>
    </View>
  );
}
