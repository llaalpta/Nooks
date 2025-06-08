import { View } from 'react-native';

import ThemeDebugComponent from '@/components/examples/ThemeDebugComponent';
import ThemeToggle from '@/components/examples/ThemeToggle';

export default function TabsIndex() {
  return (
    <View>
      <ThemeToggle />
      <ThemeDebugComponent />
    </View>
  );
}
