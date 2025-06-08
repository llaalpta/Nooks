import { Tabs } from 'expo-router';
import React from 'react';
import { View, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CustomHeader } from '@/components/common/CustomHeader';
import { useAppTheme } from '@/contexts/ThemeContext';

export default function TabsLayout() {
  const theme = useAppTheme();

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {/* Header personalizado para las tabs principales */}
        <CustomHeader />

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
              tabBarIcon: ({ size }) => (
                <Image
                  source={require('@/assets/images/home.png')}
                  style={{
                    width: size,
                    height: size,
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />

          <Tabs.Screen
            name="realms"
            options={{
              title: 'Realms',
              tabBarIcon: ({ size }) => (
                <Image
                  source={require('@/assets/images/realm-marker-small.png')}
                  style={{
                    width: size,
                    height: size,
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="treasures"
            options={{
              title: 'Treasures',
              tabBarIcon: ({ size }) => (
                <Image
                  source={require('@/assets/images/treasure.png')}
                  style={{
                    width: size,
                    height: size,
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="map"
            options={{
              title: 'Mapa',
              tabBarIcon: ({ size }) => (
                <Image
                  source={require('@/assets/images/map.png')}
                  style={{
                    width: size,
                    height: size,
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="tags"
            options={{
              title: 'Tags',
              tabBarIcon: ({ size }) => (
                <Image
                  source={require('@/assets/images/tags.png')}
                  style={{
                    width: size,
                    height: size,
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          {/* Eliminamos la tab de perfil ya que ahora está en la cabecera */}
        </Tabs>
      </View>
    </SafeAreaProvider>
  );
}
