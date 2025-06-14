import { useLocalSearchParams, router } from 'expo-router';
import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { CustomFormHeader } from '@/components/common/CustomFormHeader';
import { useAppTheme } from '@/contexts/ThemeContext';
import { NookCard } from '@/features/nooks/components/NookCard';
import { useNooksQuery } from '@/features/nooks/hooks';
import { createRealmFormStyles } from '@/styles/app/modals/form.style';

export default function NookSelectorScreen() {
  const params = useLocalSearchParams<{
    realmId?: string;
  }>();
  const realmId = params.realmId;
  const theme = useAppTheme();
  const styles = createRealmFormStyles(theme);

  const { data: nooks = [], isLoading: isLoadingNooks } = useNooksQuery(realmId || '');

  // Debug logs para verificar que los datos están llegando correctamente
  useEffect(() => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('🐛 [NookSelector] Debug info:', {
        realmId,
        nooksCount: nooks.length,
        isLoadingNooks,
      });
      // eslint-disable-next-line no-console
      console.log('🐛 [NookSelector] Nooks data:', nooks);
    }
  }, [realmId, nooks.length, isLoadingNooks, nooks]);
  const handleNookSelect = (nook: any) => {
    router.push({
      pathname: '/treasures/treasure-form',
      params: { realmId, nookId: nook.id },
    });
  };

  const handleCreateNook = () => {
    router.push({
      pathname: '/nooks/nook-form',
      params: { realmId, from: 'nook-selector' },
    });
  };

  const handleBack = () => {
    router.back();
  };

  if (!realmId) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <CustomFormHeader title="Error" onBack={handleBack} />
        <View
          style={[
            styles.formContainer,
            { flex: 1, justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <Text style={{ color: theme.colors.error, textAlign: 'center' }}>
            No se especificó un realm válido
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <CustomFormHeader title="Selecciona nook" onBack={handleBack} />

      <View style={[styles.formContainer, { flex: 1, padding: theme.spacing.m }]}>
        <View
          style={{
            flex: 1,
          }}
        >
          {/* Header */}
          <View
            style={{
              marginBottom: theme.spacing.l,
            }}
          >
            <Text
              variant="headlineSmall"
              style={{
                color: theme.colors.onSurface,
                fontWeight: '600',
                marginBottom: theme.spacing.s,
              }}
            >
              Elige un nook
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant,
              }}
            >
              Selecciona dónde quieres crear tu treasure o crea un nuevo nook
            </Text>
          </View>

          {/* Content */}
          {isLoadingNooks ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: theme.colors.onSurfaceVariant,
                  textAlign: 'center',
                }}
              >
                Cargando nooks...
              </Text>
            </View>
          ) : nooks.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                variant="titleMedium"
                style={{
                  color: theme.colors.onSurfaceVariant,
                  textAlign: 'center',
                  marginBottom: theme.spacing.xl,
                }}
              >
                No hay nooks en este realm
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.onSurfaceVariant,
                  textAlign: 'center',
                  marginBottom: theme.spacing.xl,
                }}
              >
                ¡Crea el primer nook para comenzar!
              </Text>
            </View>
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                gap: theme.spacing.m,
                paddingBottom: theme.spacing.xl,
              }}
              showsVerticalScrollIndicator={true}
            >
              {nooks.map((nook: any) => (
                <NookCard
                  key={nook.id}
                  nook={{ ...nook, imageUrl: nook.imageUrl || null, tags: nook.tags || [] }}
                  onPress={() => handleNookSelect(nook)}
                />
              ))}
            </ScrollView>
          )}

          {/* Bottom Button */}
          <View
            style={{
              paddingTop: theme.spacing.l,
              borderTopWidth: 1,
              borderTopColor: theme.colors.outline,
              marginTop: theme.spacing.l,
            }}
          >
            <Button
              mode="contained"
              onPress={handleCreateNook}
              style={{
                marginBottom: theme.spacing.s,
              }}
            >
              Crear nuevo nook
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
