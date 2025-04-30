import React, { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { TextInput } from '@/components/atoms/TextInput';
import { FeedbackSnackbar } from '@/components/common/FeedbackSnackbar';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useSignInMutation, useSignUpMutation } from '@/features/auth/hooks';

import { createStyles } from './styles/Auth.styles';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const signInMutation = useSignInMutation();
  const signUpMutation = useSignUpMutation();
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);

  async function signInWithEmail() {
    try {
      await signInMutation.mutateAsync({ email, password });
      setSnackbar({ visible: true, message: '¡Bienvenido!', type: 'success' });
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'Error al iniciar sesión',
        type: 'error',
      });
    }
  }

  async function signUpWithEmail() {
    try {
      await signUpMutation.mutateAsync({ email, password });
      setSnackbar({
        visible: true,
        message: 'Por favor revisa tu correo para verificar tu cuenta.',
        type: 'success',
      });
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'Error al registrarse',
        type: 'error',
      });
    }
  }

  const loading = signInMutation.isPending || signUpMutation.isPending;

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Acceso
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          label="Email"
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
          // Para los íconos, necesitarías implementar un componente de ícono o usar una librería compatible
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          label="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button mode="contained" loading={loading} onPress={signInWithEmail}>
          Sign in
        </Button>
      </View>

      <View>
        <Button mode="outlined" loading={loading} onPress={signUpWithEmail}>
          Sign up
        </Button>
      </View>

      <FeedbackSnackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        message={snackbar.message}
        type={snackbar.type}
      />
    </View>
  );
}
