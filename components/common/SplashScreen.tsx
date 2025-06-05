import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/SplashScreen.styles';
// Importar ambos logos
import LogoLight from '../common/logo'; // logo.tsx
import LogoDark from '../common/logo-dark'; // logo-dark.tsx

export default function SplashScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Cargar logo según el tema */}
      {theme.dark ? <LogoDark width={240} height={120} /> : <LogoLight width={240} height={120} />}
    </View>
  );
}
