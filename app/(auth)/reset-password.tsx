import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Alert, Image, TextInput } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { useAppTheme } from '@/contexts/ThemeContext';
import { updatePassword } from '@/features/auth/api';
import { supabase } from '@/utils/supabase';

export default function ResetPassword() {
  const { access_token, refresh_token } = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionSet, setSessionSet] = useState(false);
  const theme = useAppTheme();

  const getLogo = () => {
    return theme.dark
      ? require('@/assets/images/nooks_dark.png')
      : require('@/assets/images/nooks.png');
  };

  useEffect(() => {
    const setSession = async () => {
      if (access_token && refresh_token && !sessionSet) {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: access_token as string,
            refresh_token: refresh_token as string,
          });

          if (error) {
            console.error('Error setting session:', error);
            Alert.alert('Error', 'Enlace inválido o expirado');
            router.replace('/(auth)/login');
            return;
          }

          setSessionSet(true);
        } catch (error) {
          console.error('Error in setSession:', error);
          Alert.alert('Error', 'Enlace inválido o expirado');
          router.replace('/(auth)/login');
        }
      }
    };

    setSession();
  }, [access_token, refresh_token, sessionSet]);

  const handleResetPassword = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'La contraseña es requerida');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      Alert.alert('Éxito', 'Tu contraseña ha sido actualizada correctamente', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'No se pudo actualizar la contraseña'
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center' as const,
      padding: theme.spacing.l,
    },
    welcomeSection: {
      alignItems: 'center' as const,
      marginBottom: theme.spacing.xl,
    },
    logo: {
      width: 120,
      height: 60,
      marginBottom: theme.spacing.m,
    },
    title: {
      marginBottom: theme.spacing.s,
      textAlign: 'center' as const,
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
      color: theme.colors.onSurface,
    },
    subtitle: {
      marginBottom: theme.spacing.l,
      textAlign: 'center' as const,
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.onSurfaceVariant,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: 8,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.m,
      fontSize: 16,
      color: theme.colors.onSurface,
      backgroundColor: theme.colors.surface,
    },
    button: {
      marginTop: theme.spacing.m,
    },
    cancelButton: {
      marginTop: theme.spacing.s,
    },
  };

  if (!access_token || !refresh_token) {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeSection}>
          <Image source={getLogo()} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={styles.title}>Enlace inválido</Text>
        <Text style={styles.subtitle}>
          El enlace de recuperación de contraseña es inválido o ha expirado.
        </Text>
        <Button
          mode="contained"
          onPress={() => router.replace('/(auth)/login')}
          style={styles.button}
        >
          <Text>Volver al login</Text>
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.welcomeSection}>
        <Image source={getLogo()} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.title}>Nueva contraseña</Text>
      <Text style={styles.subtitle}>
        Ingresa tu nueva contraseña para completar la recuperación.
      </Text>

      <TextInput
        placeholder="Nueva contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />

      <TextInput
        placeholder="Confirmar nueva contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />

      <Button
        mode="contained"
        onPress={handleResetPassword}
        loading={loading}
        style={styles.button}
      >
        <Text>Actualizar contraseña</Text>
      </Button>

      <Button
        mode="outlined"
        onPress={() => router.replace('/(auth)/login')}
        style={styles.cancelButton}
      >
        <Text>Cancelar</Text>
      </Button>
    </View>
  );
}
