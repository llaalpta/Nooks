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
import { useResetPasswordMutation } from '@/features/auth/hooks';

import { createStyles } from './styles/login.styles';

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
  const styles = createStyles(theme.colors);

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
        <Text variant="headlineSmall" style={styles.title}>
          Recuperar contraseña
        </Text>

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
