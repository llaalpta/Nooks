import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

// El diálogo ahora recibe el tema para usar todos los tokens
export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)', // Un poco más oscuro para mejor contraste
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
    dialog: {
      marginHorizontal: theme.spacing.xl, // 32dp
      marginTop: '40%',
      borderRadius: theme.borderRadius.l, // 16dp según MD3 para modals/dialogs
      padding: theme.spacing.xl, // 32dp para mayor aire
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      width: 'auto',
      minWidth: 280,
      maxWidth: 400,
      ...theme.elevation.level5, // Elevación máxima para dialogs
      zIndex: 2,
    },
    title: {
      color: theme.colors.onSurface,
      textAlign: 'center',
      marginBottom: theme.spacing.s, // 8dp
    },
    description: {
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.l, // 16dp
    },
    subdescription: {
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.m, // 24dp
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '100%',
      gap: theme.spacing.m, // 16dp
    },
    button: {
      flex: 1,
      minWidth: 0,
    },
  });
