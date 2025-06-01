import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.primary,
      marginBottom: theme.spacing.m,
      borderRadius: theme.borderRadius.s,
      padding: theme.spacing.m,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 16,
      width: '90%',
      alignSelf: 'center',
      position: 'absolute',
      bottom: 0,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
    },
    success: {
      backgroundColor: theme.colors.success,
    },
    error: {
      backgroundColor: theme.colors.error,
    },
    info: {
      backgroundColor: theme.colors.info,
    },
    message: {
      color: '#FFFFFF',
      flex: 1,
      marginRight: 8,
    },
    action: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
  });
