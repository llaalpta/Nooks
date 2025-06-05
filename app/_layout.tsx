import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useSegments, useRouter, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';

import { CustomHeader } from '@/components/common/CustomHeader';
import { ThemeProvider } from '@/contexts/ThemeContext';

import { AuthProvider, useAuth } from '../contexts/AuthContext';
import '../global.css';
const queryClient = new QueryClient();

// Evita que el splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync().catch(() => {
  /* El splash screen ya podría estar oculto */
});

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
  const pathname = usePathname();

  useEffect(() => {
    async function prepare() {
      try {
        // Aquí puedes poner código de inicialización adicional:
        // - Cargar recursos
        // - Inicializar servicios
        // - Etc.
        // Simular un tiempo de carga para que el splash screen sea visible
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.error('Error al preparar la app:', e);
      } finally {
        // Indica que la app está lista para renderizar
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Oculta el splash screen cuando la app está lista
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  } // Determinar si mostrar el header y el botón de volver
  const isAuthScreen = pathname.startsWith('/(auth)');

  // El botón de volver se muestra en:
  // - Modales (/(modals)/)
  // - Formularios y pantallas de detalles fuera de tabs principales
  // - NO en las tabs principales ni en auth
  const isMainTabScreen =
    pathname === '/(tabs)' ||
    pathname === '/(tabs)/' ||
    pathname === '/(tabs)/index' ||
    pathname === '/(tabs)/search' ||
    pathname === '/(tabs)/realms' ||
    pathname === '/(tabs)/map';

  const shouldShowBackButton = !isAuthScreen && !isMainTabScreen;

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ActionSheetProvider>
            <AuthGate>
              <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
                {/* Solo mostrar header si NO es pantalla de auth */}
                {!isAuthScreen && <CustomHeader showBackButton={shouldShowBackButton} />}
                <Slot />
              </View>
            </AuthGate>
          </ActionSheetProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
