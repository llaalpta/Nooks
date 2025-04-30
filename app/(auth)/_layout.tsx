import { Slot } from 'expo-router';
import React from 'react';
import { View, ImageBackground } from 'react-native';

import { styles } from './styles/layout.styles';
import background1 from '../../assets/images/background1.png';

export default function AuthLayout() {
  return (
    <ImageBackground source={background1} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <Slot />
      </View>
    </ImageBackground>
  );
}
