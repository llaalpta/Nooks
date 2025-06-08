import { StyleSheet } from 'react-native';

import { AppTheme } from '@/types';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modal: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.m,
      width: '100%',
      maxWidth: '100%',
      maxHeight: '95%', // 🔥 Casi toda la pantalla (era 100%)
      alignSelf: 'stretch',
      marginTop: 0,
    },
    header: {
      padding: 20,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.onSurface,
      textAlign: 'center',
    },
    content: {
      padding: 16,
      paddingTop: 0,
    },
    colorLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.onSurfaceVariant,
      marginTop: theme.spacing.xs,
      marginBottom: 12,
    },
    colorScroll: {
      marginBottom: theme.spacing.s,
    },
    colorGridContainer: {
      flexDirection: 'column',
      marginBottom: theme.spacing.s,
    },
    colorGridRow: {
      flexDirection: 'row',
      alignItems: 'flex-start', // 🔥 Alinear al inicio
      flexWrap: 'wrap', // 🔥 Permitir wrap
      marginBottom: 0,
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedColor: {
      borderColor: theme.colors.onSurface,
      borderWidth: 3,
    },
    previewContainer: {
      marginTop: theme.spacing.xs,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.s,
    },
    previewLabel: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.s,
    },
    previewTag: {
      borderRadius: 16,
      paddingVertical: 6,
      paddingHorizontal: 12,
      alignSelf: 'flex-start',
    },
    previewTagText: {
      color: '#FFFFFF',
      fontWeight: '500',
      fontSize: 14,
    },
    actions: {
      flexDirection: 'row',
      padding: 20,
      paddingTop: 10,
      gap: 12,
    },
    button: {
      flex: 1,
    },
  });
