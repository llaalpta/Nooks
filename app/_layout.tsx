import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useSegments, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { ThemeProvider } from '@/contexts/ThemeContext';

import { AuthProvider, useAuth } from '../contexts/AuthContext';
import '../global.css';
const queryClient = new QueryClient();

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
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthGate>
            <Slot />
          </AuthGate>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
