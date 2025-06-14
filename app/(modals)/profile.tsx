import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import Account from '@/components/auth/Account';
import { DetailsScreenHeader } from '@/components/common/DetailsScreenHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';

export default function ProfileScreen() {
  const { session } = useAuth();
  const theme = useAppTheme();

  if (!session) {
    return null;
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      edges={['left', 'right', 'bottom']}
    >
      <DetailsScreenHeader
        title="Perfil"
        backRoute="/(tabs)"
        showOptionsMenu={false}
        optionsMenuItems={[]}
      />
      <Account session={session} />
    </SafeAreaView>
  );
}
