import { View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import ThemeDebugComponent from '@/components/examples/ThemeDebugComponent';
import ThemeToggle from '@/components/examples/ThemeToggle';

export default function TabsIndex() {
  return (
    <View>
      <ThemeToggle />
      <ThemeDebugComponent />
      <EmptyState message="Contenido vacío" />
    </View>
  );
}
