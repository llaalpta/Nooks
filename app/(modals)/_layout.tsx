import { Slot } from 'expo-router';
import { View } from 'react-native';

import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/layout.styles';

export default function ModalsLayout() {
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);

  return (
    <View style={styles.container}>
      <Slot />
    </View>
  );
}
