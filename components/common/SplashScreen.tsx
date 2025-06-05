import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/SplashScreen.styles';
import AppLogo from '../logo/AppLogo';

export default function SplashScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <AppLogo size={120} animated={true} />
    </View>
  );
}
