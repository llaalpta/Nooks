import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme, useThemeMode } from '@/contexts/ThemeContext';

import { createStyles } from './styles/CustomHeader.style';

export const CustomHeader = () => {
  const theme = useAppTheme();
  const { themeMode, setThemeMode } = useThemeMode();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  const getLogoSource = () => {
    return theme.dark
      ? require('@/assets/images/nooks_dark.png')
      : require('@/assets/images/nooks.png');
  };

  const handleProfilePress = () => {
    router.push('/(modals)/profile');
  };

  const toggleTheme = () => {
    if (themeMode === 'light') {
      setThemeMode('dark');
    } else if (themeMode === 'dark') {
      setThemeMode('system');
    } else {
      setThemeMode('light');
    }
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return 'sunny';
      case 'dark':
        return 'moon';
      case 'system':
      default:
        return 'phone-portrait';
    }
  };
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Botón de volver */}
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons name={getThemeIcon()} size={24} color={theme.colors.primary} />
        </TouchableOpacity>

        {/* Logo centrado */}
        <View style={styles.logoContainer}>
          <Image source={getLogoSource()} style={styles.logo} resizeMode="contain" />
        </View>
        {/* Botones de la derecha */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            <Ionicons name="person-circle" size={32} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
