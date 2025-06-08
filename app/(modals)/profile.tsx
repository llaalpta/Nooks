import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import Account from '@/components/auth/Account';
import { CustomHeader } from '@/components/common/CustomHeader';
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
      edges={['top', 'left', 'right', 'bottom']}
    >
      <CustomHeader />
      <Account session={session} />
    </SafeAreaView>
  );
}
