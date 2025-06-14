import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, KeyboardAvoidingView, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/atoms/Text';
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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['left', 'right']}
    >
      {/* Header con título, subtítulo e ícono */}
      <View
        style={{
          paddingHorizontal: theme.spacing.l,
          paddingVertical: theme.spacing.m,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outlineVariant + '40',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            variant="headlineMedium"
            style={{ color: theme.colors.onSurface, fontWeight: '600' }}
          >
            Crear Tag
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, marginTop: theme.spacing.xs }}
          >
            Añade etiquetas para tus elementos
          </Text>
        </View>
        <Image
          source={require('@/assets/images/tags.png')}
          style={{
            width: 32,
            height: 32,
            marginLeft: theme.spacing.m,
          }}
          resizeMode="contain"
        />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={60}
      >
        <CreateTagForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          showTitle={false}
          autoFocus={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
