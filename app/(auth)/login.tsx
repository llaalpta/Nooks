import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View, Image } from 'react-native';
import { z } from 'zod';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { FeedbackSnackbar } from '@/components/common/FeedbackSnackbar';
import { ControlledTextInput } from '@/components/forms/ControlledTextInput';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useSignInMutation } from '@/features/auth/hooks';
import { createStyles } from '@/styles/app/auth/login.style';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});
type LoginForm = z.infer<typeof schema>;

export default function LoginScreen() {
  const methods = useForm<LoginForm>({ resolver: zodResolver(schema) });
  const { handleSubmit } = methods;
  const [snackbar, setSnackbar] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });
  const router = useRouter();
  const mutation = useSignInMutation();
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const getLogoSource = () => {
    return theme.dark
      ? require('@/assets/images/nooks_dark.png')
      : require('@/assets/images/nooks.png');
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      await mutation.mutateAsync({ email: data.email, password: data.password });
      setSnackbar({ visible: true, message: '¡Bienvenido!', type: 'success' });
      router.replace('/(tabs)');
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'Error al iniciar sesión',
        type: 'error',
      });
    }
  };
  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <View style={styles.welcomeSection}>
          <Image source={getLogoSource()} style={styles.logo} resizeMode="contain" />
          <Text variant="headlineMedium" style={styles.welcomeTitle}>
            ¡Bienvenido de nuevo a
          </Text>
          <Text variant="headlineLarge" style={styles.brandTitle}>
            Nooks!
          </Text>
        </View>

        <View style={styles.formSection}>
          <ControlledTextInput
            name="email"
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <ControlledTextInput
            name="password"
            label="Contraseña"
            secureTextEntry
            autoCapitalize="none"
          />

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={mutation.isPending}
            style={styles.button}
          >
            Entrar
          </Button>

          <Button mode="text" onPress={() => router.push('/register')} style={styles.textButton}>
            ¿No tienes cuenta? Regístrate
          </Button>

          <Button
            mode="text"
            onPress={() => router.push('/forgot-password')}
            style={styles.textButton}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </View>
      </View>
      <FeedbackSnackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        message={snackbar.message}
        type={snackbar.type}
      />
    </FormProvider>
  );
}
