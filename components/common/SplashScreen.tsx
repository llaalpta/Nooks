import React from 'react';
import { View, Image } from 'react-native';

// eslint-disable-next-line import/no-unresolved
import splashIcon from '@/assets/images/splash-icon.png';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/SplashScreen.styles';

export default function SplashScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);

  return (
    <View style={styles.container}>
      <Image source={splashIcon} style={styles.image} resizeMode="contain" />
    </View>
  );
}
