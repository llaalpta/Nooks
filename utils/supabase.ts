import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import type { Database } from '../types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Verificar si estamos en un entorno que tiene window
const isWeb = Platform.OS === 'web';
const canUseAsyncStorage = isWeb ? typeof window !== 'undefined' : true;

// Storage alternativo para entornos sin window
const noopStorage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: canUseAsyncStorage ? AsyncStorage : noopStorage,
    autoRefreshToken: true,
    persistSession: canUseAsyncStorage,
    detectSessionInUrl: isWeb && canUseAsyncStorage,
  },
});
