import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      ...theme.elevation.level1,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.sm,
      minHeight: 62,
    },
    backButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.s,
      marginRight: theme.spacing.s,
    },
    logoContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: '100%',
      height: 40,
    },
    profileButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.s,
      marginLeft: theme.spacing.s,
    },
  });
