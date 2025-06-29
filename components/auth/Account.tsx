import { Session } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { FeedbackSnackbar } from '@/components/common/FeedbackSnackbar';
import { useAppTheme } from '@/contexts/ThemeContext';
import {
  useProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from '@/features/account/hooks';
import { useSignOutMutation } from '@/features/auth/hooks';

import { ControlledImagePicker } from '../forms/ControlledImagePicker';
import { ControlledTextInput } from '../forms/ControlledTextInput';
import { createStyles } from './styles/Account.styles';

interface ProfileForm {
  username: string;
  avatar_url: string;
}

export default function Account({ session }: { session: Session }) {
  const userId = session?.user?.id;
  const { data, isLoading: profileLoading } = useProfileQuery(userId);
  const updateProfileMutation = useUpdateProfileMutation();
  const uploadAvatarMutation = useUploadAvatarMutation();
  const signOutMutation = useSignOutMutation();
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const methods = useForm<ProfileForm>({
    defaultValues: { username: '', avatar_url: '' },
  });
  const { setValue, handleSubmit } = methods;
  const email = session?.user?.email || '';

  const [pendingAvatarUri, setPendingAvatarUri] = useState<string | null>(null);

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    if (data) {
      setValue('username', data.username || '');
      setValue('avatar_url', data.avatar_url || '');
    }
  }, [data, setValue]);

  function handleAvatarChange(localUri: string) {
    setPendingAvatarUri(localUri);
    setValue('avatar_url', localUri);
  }

  async function onSubmit(form: ProfileForm) {
    try {
      let finalAvatarUrl = form.avatar_url;

      if (pendingAvatarUri) {
        finalAvatarUrl = await uploadAvatarMutation.mutateAsync({
          userId,
          localUri: pendingAvatarUri,
        });
        setPendingAvatarUri(null);
      }

      await updateProfileMutation.mutateAsync({
        userId,
        updates: { ...form, avatar_url: finalAvatarUrl },
      });

      setSnackbar({ visible: true, message: 'Perfil actualizado', type: 'success' });
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'Error al actualizar el perfil',
        type: 'error',
      });
    }
  }

  async function handleSignOut() {
    try {
      await signOutMutation.mutateAsync();
      setSnackbar({ visible: true, message: 'Sesión cerrada', type: 'success' });
    } catch (error: any) {
      setSnackbar({
        visible: true,
        message: error.message || 'Error al cerrar sesión',
        type: 'error',
      });
    }
  }

  const loading =
    profileLoading || updateProfileMutation.isPending || uploadAvatarMutation.isPending;

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <View style={[styles.section, { alignItems: 'center', marginBottom: theme.spacing.l }]}>
          <ControlledImagePicker
            name="avatar_url"
            onImageChange={handleAvatarChange}
            style={{ marginBottom: theme.spacing.s }}
            avatarMode
            avatarSize={220}
          />
          {(uploadAvatarMutation.isPending || pendingAvatarUri) && (
            <Text variant="bodySmall" style={styles.uploadingText}>
              {pendingAvatarUri ? 'Imagen seleccionada (presiona Guardar)' : 'Subiendo avatar...'}
            </Text>
          )}
          <Text variant="titleMedium" style={{ marginTop: theme.spacing.s, fontWeight: '700' }}>
            {methods.getValues('username') || 'Sin nombre'}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
            {email}
          </Text>
        </View>

        <View style={styles.section}>
          <ControlledTextInput name="username" label="Nombre de usuario" />
        </View>

        <View style={styles.section}>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
          >
            Guardar
          </Button>
        </View>

        <View>
          <Button mode="outlined" onPress={handleSignOut} loading={signOutMutation.isPending}>
            Cerrar sesión
          </Button>
        </View>

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
