import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';

import { createStyles } from './styles/CustomHeader.style';

interface CustomHeaderProps {
  title?: string;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
  title = 'NOOKS', // Cambia por el nombre de tu app
}) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  const handleProfilePress = () => {
    router.push('/profile');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Logo/Título de la aplicación */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Botón de perfil */}
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <Ionicons name="person-circle" size={32} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
