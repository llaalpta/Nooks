import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/CustomHeader.style';

interface CustomFormHeaderProps {
  title: string;
  backTo?: string;
  onBack?: () => void;
}

export const CustomFormHeader: React.FC<CustomFormHeaderProps> = ({ title, backTo, onBack }) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      router.replace(backTo as any);
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          accessibilityLabel="Volver"
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[styles.headerTitle, { textAlign: 'center' }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
        {/* Espacio a la derecha para simetría visual */}
        <View style={{ width: 32 }} />
      </View>
    </View>
  );
};
