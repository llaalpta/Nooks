import { View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { useAppTheme } from '@/contexts/ThemeContext';
import { createStyles } from '@/styles/app/treasures/layout.style';

export default function TreasuresLayout() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <EmptyState message="Contenido vacío" />
    </View>
  );
}
