import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
    dialog: {
      marginHorizontal: theme.spacing.xl,
      marginTop: '40%',
      borderRadius: theme.borderRadius.l,
      padding: theme.spacing.xl,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      width: 'auto',
      minWidth: 280,
      maxWidth: 400,
      ...theme.elevation.level5,
      zIndex: 2,
    },
    title: {
      color: theme.colors.onSurface,
      textAlign: 'center',
      marginBottom: theme.spacing.s,
    },
    description: {
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.l,
    },
    subdescription: {
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.m,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '100%',
      gap: theme.spacing.m,
    },
    button: {
      flex: 1,
      minWidth: 0,
    },
  });
