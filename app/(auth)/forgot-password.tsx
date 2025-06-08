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
import { useResetPasswordMutation } from '@/features/auth/hooks';
import { createStyles } from '@/styles/app/auth/login.style';

const schema = z.object({
  email: z.string().email('Email inválido'),
});
type ForgotPasswordForm = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const methods = useForm<ForgotPasswordForm>({ resolver: zodResolver(schema) });
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
  const mutation = useResetPasswordMutation();
  const router = useRouter();
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const getLogoSource = () => {
    return theme.dark
      ? require('@/assets/images/nooks_dark.png')
      : require('@/assets/images/nooks.png');
  };

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await mutation.mutateAsync(data.email);
      setSnackbar({
        visible: true,
        message: 'Revisa tu email para restablecer la contraseña.',
        type: 'success',
      });
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'Error al enviar el email',
        type: 'error',
      });
    }
  };
  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        {/* Logo y mensaje de bienvenida */}
        <View style={styles.welcomeSection}>
          <Image source={getLogoSource()} style={styles.logo} resizeMode="contain" />
          <Text variant="headlineMedium" style={styles.welcomeTitle}>
            Recuperar acceso a
          </Text>
          <Text variant="headlineLarge" style={styles.brandTitle}>
            Nooks
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.formSection}>
          <ControlledTextInput
            name="email"
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={mutation.isPending}
            style={styles.button}
          >
            Enviar email de recuperación
          </Button>

          <Button mode="text" onPress={() => router.push('/login')} style={styles.textButton}>
            Volver a iniciar sesión
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
