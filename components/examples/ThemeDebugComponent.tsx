import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useAppTheme, useThemeMode } from '@/contexts/ThemeContext';

const ThemeDebugComponent = () => {
  const theme = useAppTheme();
  const { themeMode } = useThemeMode();

  const isDarkMode = theme.dark;

  return (
    <View style={[styles.container, { backgroundColor: 'theme.colors.red' }]}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>🎨 Debug del Tema</Text>

      <View style={styles.infoCard}>
        <Text style={{ color: theme.colors.onSurface }}>📱 Configuración: {themeMode}</Text>
        <Text style={{ color: theme.colors.onSurface }}>
          🌓 Tema actual: {isDarkMode ? 'Oscuro' : 'Claro'}
        </Text>
        <Text style={{ color: theme.colors.onSurface }}>
          🎯 Propiedad theme.dark: {String(isDarkMode)}
        </Text>
      </View>

      <View
        style={[
          styles.exampleBox,
          {
            backgroundColor: isDarkMode ? theme.colors.primary : theme.colors.secondary,
            borderColor: theme.colors.outline,
          },
        ]}
      >
        <Text style={{ color: isDarkMode ? theme.colors.onPrimary : theme.colors.onSecondary }}>
          {isDarkMode ? '🌙 Modo oscuro activo' : '☀️ Modo claro activo'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoCard: {
    padding: 12,
    marginVertical: 8,
    gap: 4,
  },
  exampleBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 12,
  },
});

export default ThemeDebugComponent;
