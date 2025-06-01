import { View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { useAppTheme } from '@/contexts/ThemeContext';
import { createStyles } from '@/styles/app/modals/form.style';

export default function TreasureFormModal() {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <EmptyState message="Contenido vacío" />
    </View>
  );
}
