import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/SplashScreen.styles';
import LogoLight from '../common/logo';
import LogoDark from '../common/logo-dark';

export default function SplashScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {theme.dark ? <LogoDark width={240} height={120} /> : <LogoLight width={240} height={120} />}
    </View>
  );
}
