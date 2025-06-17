import '../shims';

// Polyfills for React Native Web must be imported before any other imports

import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import { Slot, useSegments, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';

import { ThemeProvider } from '@/contexts/ThemeContext';

import { AuthProvider, useAuth } from '../contexts/AuthContext';
import '../global.css';
// Manejo de deep links para confirmación/restablecimiento de Supabase

const queryClient = new QueryClient();

// prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync().catch(() => {});

function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments, router]);

  if (loading) return null;
  return <>{children}</>;
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const router = useRouter();

  // Manejo de deep links para confirmación/restablecimiento de Supabase
  useEffect(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      // Ejemplo de URL: nooks://auth/callback?token=abc123&type=recovery
      if (url) {
        const { queryParams } = Linking.parse(url);
        // Redirigir a confirmación si hay token
        if (queryParams?.token) {
          const confirmPath = '/(auth)/confirm' as any;
          router.push({
            pathname: confirmPath,
            params: {
              token: queryParams.token,
              type: queryParams.type,
              email: queryParams.email,
            },
          });
        // Redirigir a reset-password si hay access_token y refresh_token
        } else if (queryParams?.access_token && queryParams?.refresh_token) {
          const resetPath = '/(auth)/reset-password' as any;
          router.push({
            pathname: resetPath,
            params: {
              access_token: queryParams.access_token,
              refresh_token: queryParams.refresh_token,
            },
          });
        }
      }
    });
    return () => subscription.remove();
  }, [router]);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (e) {
        console.error('Error al preparar la app:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ActionSheetProvider>
            <AuthGate>
              <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
                <Slot />
              </View>
            </AuthGate>
          </ActionSheetProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
