import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { useAppTheme, useThemeMode } from '@/contexts/ThemeContext';

const ThemeToggle = () => {
  const theme = useAppTheme();
  const { themeMode, setThemeMode } = useThemeMode();

  const toggleTheme = () => {
    if (themeMode === 'light') {
      setThemeMode('dark');
    } else if (themeMode === 'dark') {
      setThemeMode('system');
    } else {
      setThemeMode('light');
    }
  };

  const getThemeInfo = () => {
    switch (themeMode) {
      case 'light':
        return { icon: 'sunny', label: 'Claro', next: 'Cambiar a Oscuro' };
      case 'dark':
        return { icon: 'moon', label: 'Oscuro', next: 'Cambiar a Sistema' };
      case 'system':
      default:
        return { icon: 'phone-portrait', label: 'Sistema', next: 'Cambiar a Claro' };
    }
  };

  const themeInfo = getThemeInfo();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        🎨 Configuración de Tema
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={toggleTheme}
      >
        <Ionicons name={themeInfo.icon as any} size={24} color={theme.colors.onPrimary} />
        <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>
          {themeInfo.label}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
        Toca para cambiar: {themeInfo.next}
      </Text>

      <Text style={[styles.status, { color: theme.colors.onSurfaceVariant }]}>
        Estado actual: {theme.dark ? 'Oscuro' : 'Claro'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  status: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default ThemeToggle;
