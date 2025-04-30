import { View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/form.styles';

export default function AddOptionsModal() {
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);

  return (
    <View style={styles.container}>
      <EmptyState message="Contenido vacío" />
    </View>
  );
}
