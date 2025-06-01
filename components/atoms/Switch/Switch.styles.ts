import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    track: {
      width: 50,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.colors.surfaceVariant,
    },
    trackActive: {
      backgroundColor: theme.colors.primary,
    },
    thumb: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: theme.colors.surface,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
    },
  });
