import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button, TextInput } from 'react-native';

import { supabase } from '@/utils/supabase'; // Ajusta la ruta si es necesario

export default function ConfirmScreen() {
  const { token, type, email } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function handleConfirm() {
      if (!token || typeof token !== 'string') {
        setResult('Token inválido');
        setLoading(false);
        return;
      }

      // Solo permitimos los tipos válidos de OTP para email
      const validEmailTypes = [
        'signup',
        'invite',
        'magiclink',
        'recovery',
        'email_change',
      ] as const;
      type EmailOtpType = (typeof validEmailTypes)[number];
      const actionType: EmailOtpType =
        typeof type === 'string' && validEmailTypes.includes(type as EmailOtpType)
          ? (type as EmailOtpType)
          : 'signup'; // Por defecto 'signup' para confirmación

      if (actionType === 'recovery') {
        // Mostrar formulario para nueva contraseña
        setShowPasswordForm(true);
        setLoading(false);
        return;
      }

      // Confirmación de email (requiere email)
      if (!email || typeof email !== 'string') {
        setResult('Falta el email en el enlace.');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        token,
        type: actionType,
        email,
      });

      if (error) {
        setResult('Error: ' + error.message);
      } else {
        setResult('¡Correo confirmado! Ya puedes iniciar sesión.');
      }
      setLoading(false);
    }
    handleConfirm();
  }, [token, type, email]);

  async function handlePasswordReset() {
    setPasswordError(null);
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordError(error.message);
      setLoading(false);
    } else {
      setResult('¡Contraseña restablecida! Ya puedes iniciar sesión.');
      setShowPasswordForm(false);
      setLoading(false);
    }
  }

  if (loading) return <ActivityIndicator />;
  if (showPasswordForm) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ marginBottom: 16 }}>Introduce tu nueva contraseña:</Text>
        <TextInput
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Nueva contraseña"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 8,
            width: 220,
            marginBottom: 8,
          }}
        />
        {passwordError && <Text style={{ color: 'red', marginBottom: 8 }}>{passwordError}</Text>}
        <Button title="Restablecer contraseña" onPress={handlePasswordReset} />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ marginBottom: 16 }}>{result}</Text>
      <Button title="Ir al login" onPress={() => router.replace('/(auth)/login')} />
    </View>
  );
}
