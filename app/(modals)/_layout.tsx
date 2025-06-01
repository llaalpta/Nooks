import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/contexts/ThemeContext';
import { createStyles } from '@/styles/app/modals/layout.style';

export default function ModalsLayout() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <Slot />
    </SafeAreaView>
  );
}
