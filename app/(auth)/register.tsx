import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { FeedbackSnackbar } from '@/components/common/FeedbackSnackbar';
import { ControlledTextInput } from '@/components/forms/ControlledTextInput';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useSignUpMutation } from '@/features/auth/hooks';

import { createStyles } from './styles/login.styles';

const schema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });
type RegisterForm = z.infer<typeof schema>;

export default function RegisterScreen() {
  const methods = useForm<RegisterForm>({ resolver: zodResolver(schema) });
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

  const mutation = useSignUpMutation();
  const router = useRouter();
  const theme = useAppTheme();
  const styles = createStyles(theme.colors);

  const onSubmit = async (data: RegisterForm) => {
    try {
      await mutation.mutateAsync({ email: data.email, password: data.password });
      setSnackbar({
        visible: true,
        message: '¡Registro exitoso! Revisa tu email para verificar tu cuenta.',
        type: 'success',
      });
      // Puedes redirigir si quieres: router.replace('/(tabs)');
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'Error al registrar',
        type: 'error',
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          Registro
        </Text>

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

        <ControlledTextInput
          name="confirmPassword"
          label="Repite la contraseña"
          secureTextEntry
          autoCapitalize="none"
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={mutation.isPending}
          style={styles.button}
        >
          Crear cuenta
        </Button>

        <Button mode="text" onPress={() => router.push('/login')} style={styles.textButton}>
          ¿Ya tienes cuenta? Inicia sesión
        </Button>

        <FeedbackSnackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
          message={snackbar.message}
          type={snackbar.type}
        />
      </View>
    </FormProvider>
  );
}
