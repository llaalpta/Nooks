import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAppTheme } from '@/contexts/ThemeContext';

export default function TabsLayout() {
  const theme = useAppTheme();

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
            tabBarStyle: {
              backgroundColor: theme.colors.surface,
            },
            // Ocultar el header nativo ya que usamos el personalizado
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Inicio',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              title: 'Buscar',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="search-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="realms"
            options={{
              title: 'Reinos',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="map"
            options={{
              title: 'Mapa',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="map-outline" size={size} color={color} />
              ),
            }}
          />
          {/* Eliminamos la tab de perfil ya que ahora está en la cabecera */}
        </Tabs>
      </View>
    </SafeAreaProvider>
  );
}
