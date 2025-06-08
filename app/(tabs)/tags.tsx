import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/contexts/ThemeContext';

import { CreateTagForm } from '../tags/CreateTagForm';

export default function CreateTagModal() {
  const theme = useAppTheme();
  const router = useRouter();

  const handleSuccess = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={60}
      >
        <CreateTagForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          showTitle={true}
          autoFocus={true}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
