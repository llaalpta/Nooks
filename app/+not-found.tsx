import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';

import { styles } from './styles/not-found.style';

export default function NotFoundScreen() {
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
