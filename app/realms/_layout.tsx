import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/layout.style';

export default function RealmsLayout() {
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <Slot />
    </SafeAreaView>
  );
}
